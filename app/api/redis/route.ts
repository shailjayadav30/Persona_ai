
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  await redis.set("name", "Hitesh");

  const value = await redis.get("name");

  return NextResponse.json({
    value,
  });
}
