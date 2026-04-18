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
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border">
          <h1 className="text-2xl font-bold mb-4 text-center">S5auth 登录</h1>
          <p className="mb-8 text-gray-600 text-center">
            您需要登录 S5auth 才能授权此应用。
          </p>
          <div className="space-y-4">
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: currentUrl.toString() });
              }}
            >
              <button className="w-full bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition active:scale-95">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                通过 GitHub 登录
              </button>
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("microsoft-entra-id", {
                  redirectTo: currentUrl.toString(),
                });
              }}
            >
              <button className="w-full bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                通过 Microsoft 登录
              </button>
            </form>
          </div>
        </div>
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
