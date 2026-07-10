import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(request: NextRequest) {
  console.log("Inside");
  try {
    console.log("Inside 111");

    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },  
        { status: 404 },
      );
    }
    const hashedPass = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
      },
    });
    return NextResponse.json({ email: email, name: name }, { status: 201 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      { status: 500 },
    );
  }
}
