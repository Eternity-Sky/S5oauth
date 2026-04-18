"use server";

import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit";

export async function approveAuthorization(data: {
  userId: string;
  clientId: string;
  redirectUri: string;
  state?: string;
  clientName: string;
}) {
  const { userId, clientId, redirectUri, state, clientName } = data;
  let redirectUrl = "";

  try {
    const code = nanoid(32);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 1. 创建授权码
    await prisma.oAuthCode.create({
      data: {
        code,
        expires,
        userId,
        clientId,
        redirectUri,
      },
    });

    // 2. 增加统计次数
    try {
      await prisma.stats.upsert({
        where: { id: "global" },
        update: { count: { increment: 1 } },
        create: { id: "global", count: 1 },
      });
    } catch (e) {
      console.error("Failed to update stats:", e);
      // Stats failure shouldn't block the whole flow
    }

    // 3. 记录安全审计日志
    try {
      await createAuditLog(userId, "OAUTH_AUTHORIZE", {
        clientId,
        clientName,
      });
    } catch (e) {
      console.error("Failed to create audit log:", e);
      // Audit log failure shouldn't block the whole flow
    }

    // 4. 构建重定向 URL
    const url = new URL(redirectUri);
    url.searchParams.set("code", code);
    if (state) url.searchParams.set("state", state);

    redirectUrl = url.toString();
  } catch (error) {
    if ((error as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Authorization approval error:", error);
    throw new Error("Internal server error during authorization");
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
