/**
 * 验证 Cloudflare Turnstile 令牌
 * @param token 从前端获取的 turnstile-response 令牌
 * @returns 是否验证通过
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY 环境变量未设置，跳过验证 (仅用于测试)");
    return true;
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    },
  );

  const data = await response.json();
  return data.success;
}
