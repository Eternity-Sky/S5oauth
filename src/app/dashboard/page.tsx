import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createOAuthClient } from "../actions/oauth";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  const clients = await prisma.oAuthClient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">开发者控制台</h1>
          <a
            href="/"
            className="text-blue-600 hover:underline"
          >
            返回首页
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">创建新应用</h2>
          <form action={createOAuthClient} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                应用名称
              </label>
              <input
                name="name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="我的网站"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                回调 URL (Redirect URI)
              </label>
              <input
                name="redirectUri"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://example.com/api/auth/callback/s5auth"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              创建应用
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">您的应用 (OAuth Clients)</h2>

          {clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">
              您还没有创建任何应用。
            </div>
          ) : (
            <div className="space-y-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-6 border rounded-xl hover:border-blue-300 transition bg-gray-50/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-blue-900">{client.name}</h3>
                    <span className="text-xs text-gray-400">
                      创建于 {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1 font-medium">Client ID</p>
                      <code className="bg-white border px-3 py-2 rounded-lg block select-all font-mono text-blue-700">
                        {client.clientId}
                      </code>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 font-medium">Client Secret</p>
                      <code className="bg-white border px-3 py-2 rounded-lg block select-all font-mono text-blue-700">
                        {client.clientSecret}
                      </code>
                      <p className="text-xs text-red-400 mt-1">请妥善保管此密钥，切勿泄露。</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 font-medium">Redirect URIs</p>
                      <div className="space-y-1">
                        {client.redirectUris.map((uri, i) => (
                          <code key={i} className="bg-white border px-3 py-2 rounded-lg block font-mono text-gray-600">
                            {uri}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h2 className="text-blue-800 font-bold mb-2 text-lg">集成指南</h2>
          <p className="text-blue-700 text-sm mb-4">
            使用以下端点将 S5auth 集成到您的应用中：
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Authorization Endpoint</p>
              <code className="bg-white/80 border border-blue-100 px-3 py-1 rounded block text-sm font-mono text-blue-900">
                https://s5auth.netlify.app/api/oidc/authorize
              </code>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Token Endpoint</p>
              <code className="bg-white/80 border border-blue-100 px-3 py-1 rounded block text-sm font-mono text-blue-900">
                https://s5auth.netlify.app/api/oidc/token
              </code>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">UserInfo Endpoint</p>
              <code className="bg-white/80 border border-blue-100 px-3 py-1 rounded block text-sm font-mono text-blue-900">
                https://s5auth.netlify.app/api/oidc/userinfo
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
