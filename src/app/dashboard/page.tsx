import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createOAuthClient } from "../actions/oauth";
import { DeleteButton } from "./DeleteButton";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  const clients = await prisma.oAuthClient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-[family-name:var(--font-geist-sans)]">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic text-sm">
              S5
            </div>
            <span className="font-bold text-slate-900 tracking-tighter">
              控制台
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              返回首页
            </a>
            <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm">
              <img
                src={session.user?.image || ""}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            应用管理
          </h1>
          <p className="text-slate-500">
            在这里创建和管理您的 OAuth 2.0 客户端凭据。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 左侧：创建表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-28">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                创建新应用
              </h2>
              <form action={createOAuthClient} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    应用名称
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="例如：我的博客"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    回调 URL (Redirect URI)
                  </label>
                  <input
                    name="redirectUri"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://example.com/api/callback"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                  立即创建
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：应用列表 */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 px-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              您的应用 ({clients.length})
            </h2>

            {clients.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">
                  暂无应用，请从左侧开始创建。
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="font-black text-2xl text-slate-900 mb-1">
                          {client.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">
                          ID: {client.id}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                          Active
                        </span>
                        <DeleteButton
                          clientId={client.clientId}
                          clientName={client.name}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="relative group/field">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                          Client ID
                        </p>
                        <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl font-mono text-sm text-blue-600 flex justify-between items-center overflow-hidden">
                          <code className="truncate pr-4">
                            {client.clientId}
                          </code>
                          <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase whitespace-nowrap">
                            复制
                          </button>
                        </div>
                      </div>

                      <div className="relative group/field">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                          Client Secret
                        </p>
                        <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl font-mono text-sm text-indigo-600 flex justify-between items-center overflow-hidden">
                          <code className="truncate pr-4">
                            {client.clientSecret}
                          </code>
                          <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase whitespace-nowrap">
                            复制
                          </button>
                        </div>
                      </div>

                      <div className="relative group/field">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                          Redirect URIs
                        </p>
                        <div className="space-y-2">
                          {client.redirectUris.map((uri, i) => (
                            <div
                              key={i}
                              className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl font-mono text-xs text-slate-500"
                            >
                              {uri}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部集成提示 */}
        <div className="mt-20 p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">集成遇到困难？</h2>
            <p className="text-slate-400 mb-8 max-w-lg">
              参考我们的详细集成文档，或者使用测试工具来模拟一次完整的 OAuth
              流程。
            </p>
            <div className="flex gap-4">
              <a
                href="/docs"
                className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
              >
                查看文档
              </a>
              <a
                href="/test-client"
                className="bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-600 transition-all active:scale-95"
              >
                去测试
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
