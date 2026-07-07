import { authOptions } from "@/lib/auth";
import { askGemini } from "@/lib/llm/gemini";
import { ModerationBlockedError } from "@/lib/llm/moderation";
import prisma from "@/lib/prisma";
import { messageSchema, personaSchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);
    if (!session) {
      return NextResponse.json(
        {
          message: "unauthorized ",
        },
        { status: 401 },
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
    const answer = await askGemini(validPersona, content);
    if (!answer) {
      return NextResponse.json(
        { message: "Gemini did not return an empty  response" },
        { status: 500 },
      );
    }
    const clientMessage = await prisma.message.create({
      data: {
        persona: validPersona,
        content,
        role: "USER",
        userId: session.user.id,
      },
    });
    const llmMessage = await prisma.message.create({
      data: {
        persona: validPersona,
        content: answer,
        role: "ASSISTANT",
        userId: session.user.id,
      },
    });
    console.log("Client Message", clientMessage);
    console.log("LLM Message", llmMessage);

    return NextResponse.json({ answer });
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
