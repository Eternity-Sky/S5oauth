import { prisma } from "./prisma";
import { headers } from "next/headers";

export async function createAuditLog(userId: string, event: string, details?: any) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  try {
    await prisma.auditLog.create({
      data: {
        userId,
        event,
        ip,
        userAgent,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
