import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { approveAuthorization } from "@/app/actions/auth-flow";

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const clientId = params.client_id as string;
  const redirectUri = params.redirect_uri as string;
  const state = params.state as string;
  const responseType = params.response_type as string;

  if (!clientId || !redirectUri || responseType !== "code") {
    return <div className="p-8 text-red-500">Invalid OAuth parameters.</div>;
  }

  const session = await auth();
  if (!session) {
    // If not logged in to S5auth, redirect to login
    // We'll pass the current URL as the callbackUrl
    const currentUrl = new URL(
      "/api/oidc/authorize",
      process.env.NEXTAUTH_URL || "https://s5auth.netlify.app",
    );
    Object.entries(params).forEach(([k, v]) =>
      currentUrl.searchParams.set(k, v as string),
    );
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">S5auth 登录</h1>
        <p className="mb-6 text-gray-600">您需要登录 S5auth 才能授权此应用。</p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: currentUrl.toString() });
          }}
        >
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold">
            通过 GitHub 登录
          </button>
        </form>
      </div>
    );
  }

  const client = await prisma.oAuthClient.findUnique({
    where: { clientId },
  });

  if (!client || !client.redirectUris.includes(redirectUri)) {
    return (
      <div className="p-8 text-red-500">Invalid client or redirect URI.</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-2xl font-bold text-center mb-6">授权请求</h1>
        <p className="text-center text-gray-600 mb-8">
          应用 <span className="font-bold text-black">{client.name}</span>{" "}
          想要访问您的 S5auth 账号信息。
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-600 p-1 rounded-full">
              ✓
            </div>
            <p className="text-sm text-gray-700">
              查看您的公开个人资料（姓名、邮箱、头像）
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <form
            action={async () => {
              "use server";
              await approveAuthorization({
                userId: session.user.id,
                clientId,
                redirectUri,
                state,
                clientName: client.name,
              });
            }}
            className="flex-1"
          >
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95"
            >
              允许
            </button>
          </form>
          <a
            href={
              redirectUri +
              "?error=access_denied" +
              (state ? `&state=${state}` : "")
            }
            className="flex-1 text-center border py-3 rounded-xl font-bold hover:bg-gray-50 transition active:scale-95"
          >
            拒绝
          </a>
        </div>
      </div>
    </div>
  );
}
