import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as jose from "jose";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const code = formData.get("code") as string;
  const clientId = formData.get("client_id") as string;
  const clientSecret = formData.get("client_secret") as string;
  const grantType = formData.get("grant_type") as string;
  const redirectUri = formData.get("redirect_uri") as string;

  if (grantType !== "authorization_code") {
    return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400 });
  }

  const oauthCode = await prisma.oAuthCode.findUnique({
    where: { code },
    include: { client: true },
  });

  if (!oauthCode) {
    return NextResponse.json({ error: "invalid_grant", message: "授权码不存在或已被使用" }, { status: 400 });
  }

  if (oauthCode.expires < new Date()) {
    return NextResponse.json({ error: "invalid_grant", message: "授权码已过期" }, { status: 400 });
  }

  if (oauthCode.clientId !== clientId) {
    return NextResponse.json({ error: "invalid_grant", message: "Client ID 不匹配" }, { status: 400 });
  }

  if (oauthCode.client.clientSecret !== clientSecret) {
    return NextResponse.json({ error: "invalid_grant", message: "Client Secret 错误" }, { status: 400 });
  }

  if (oauthCode.redirectUri !== redirectUri) {
    return NextResponse.json({ 
      error: "invalid_grant", 
      message: "Redirect URI 不匹配",
      expected: oauthCode.redirectUri,
      received: redirectUri 
    }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: oauthCode.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "invalid_user" }, { status: 400 });
  }

  // Generate tokens
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const alg = "HS256";

  const accessToken = await new jose.SignJWT({ sub: user.id })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  const idToken = await new jose.SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    picture: user.image,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .setAudience(clientId)
    .sign(secret);

  // Delete the code after use
  await prisma.oAuthCode.delete({ where: { id: oauthCode.id } });

  return NextResponse.json({
    access_token: accessToken,
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 7200,
  });
}
