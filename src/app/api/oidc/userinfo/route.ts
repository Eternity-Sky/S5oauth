import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as jose from "jose";

export const runtime = "edge";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.sub as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    return NextResponse.json({
      sub: user.id,
      name: user.name,
      email: user.email,
      picture: user.image,
    });
  } catch (err) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
}
