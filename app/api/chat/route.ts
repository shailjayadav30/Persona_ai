import { authOptions } from "@/lib/auth";
import { askGemini } from "@/lib/llm/gemini";
import {
  detectPromptInjection,
  ModerationBlockedError,
} from "@/lib/llm/moderation";
import prisma from "@/lib/prisma";
import { messageSchema, personaSchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ratelimiter } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized ",
        },
        { status: 401 },
      );
    }
    const { success, limit, reset, remaining } = await ratelimiter.limit(
      session.user.id,
    );
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests!" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    const { searchParams } = new URL(request.url);
    const persona = searchParams.get("persona");
    const parsedPersona = personaSchema.safeParse(persona);
    if (!parsedPersona.success) {
      return NextResponse.json(
        {
          message: "Invalid Persona",
        },
        { status: 400 },
      );
    }
    const body = await request.json();
    const validatedBody = messageSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: validatedBody.error,
        },
        { status: 400 },
      );
    }
    const { content } = validatedBody.data;
    const validPersona = parsedPersona.data;
    const reason = detectPromptInjection(content);
    if(reason){
        throw new ModerationBlockedError("input", reason);
    }
    let fullAns=""
    
    const stream = await askGemini(validPersona, content);
    const encoder = new TextEncoder();
    const readable=new ReadableStream({
      async start(controller){

        for await(const chunk of stream){
              const text = chunk.text ?? "";
              fullAns+=text
          controller.enqueue(
            encoder.encode(chunk.text??"")
          )
        }
        controller.close()
      }
    })
//     return new Response(readable, {
//   headers: {
//     "Content-Type": "text/plain; charset=utf-8",
//   },
// });
   
    await prisma.message.create({
      data: {
        persona: validPersona,
        content,
        role: "USER",
        userId: session.user.id,
      },
    });

    await prisma.message.create({
      data: {
        persona: validPersona,
        content: fullAns,
        role: "ASSISTANT",
        userId: session.user.id,
      },
    });
    return NextResponse.json({ fullAns });
  } catch (error) {
    if (error instanceof ModerationBlockedError) {
      console.log("Moderation blocked", error.stage, error.reason);
      return NextResponse.json(
        {
          message:
            "This message can't be answered because it was flagged by content safety filters. Please rephrase your question.",
        },
        { status: 400 },
      );
    }
    console.log("Error", error);
    return NextResponse.json(
      {
        error: "Unable to chat",
      },
      { status: 500 },
    );
  }
}
