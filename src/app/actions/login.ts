"use server";

import { signIn } from "@/auth";
import { verifyTurnstile } from "@/lib/turnstile";

export async function loginWithTurnstile(formData: FormData) {
  const token = formData.get("cf-turnstile-response") as string;
  const redirectTo = formData.get("redirectTo") as string;

  if (!token) {
    throw new Error("请完成人机验证");
  }

  const isHuman = await verifyTurnstile(token);
  if (!isHuman) {
    throw new Error("人机验证失败，请重试");
  }

  // 验证通过，执行登录
  await signIn("github", { redirectTo });
}
