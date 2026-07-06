import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { messageSchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const { persona, role, content } = await request.json();
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
    const { persona, content } = validatedBody.data;
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
    const message = await prisma.message.create({
      data: {
        userId: session.user.id,
        persona,
        content,
        role: "USER",
      },
    });
    console.log("Message", message);
    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        error: "Unable to chat",
      },
      { status: 500 },
    );
  }
}
