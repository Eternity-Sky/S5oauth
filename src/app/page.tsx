import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] selection:bg-blue-100 selection:text-blue-900">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl italic">S5</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              auth
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/docs"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              文档
            </a>
            {session ? (
              <div className="flex items-center gap-4">
                <a
                  href="/dashboard"
                  className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  进入控制台
                </a>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  立即开始
                </button>
              </form>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-8 animate-fade-in">
            ✨ 专为多站点统一认证而生
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
            统一您的用户
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              通行无阻。
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            S5auth 是一个极其简单、安全的 OAuth 2.0 身份认证服务。
            让您的多个网站共享同一套账户体系，提升用户转化率。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <div className="flex flex-col items-center gap-6">
                <div className="p-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl flex items-center gap-3 pr-6">
                  <img
                    src={session.user?.image || ""}
                    className="w-10 h-10 rounded-xl"
                    alt=""
                  />
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      欢迎回来
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {session.user?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a
                    href="/dashboard"
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all hover:shadow-2xl hover:shadow-blue-200 active:scale-95"
                  >
                    管理应用
                  </a>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button
                      type="submit"
                      className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                      退出登录
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <form
                  action={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  <button
                    type="submit"
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-slate-300 active:scale-95 flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    使用 GitHub 登录
                  </button>
                </form>
                <a
                  href="/docs"
                  className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  集成文档
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 border border-slate-100 rounded-[32px] bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                极速集成
              </h3>
              <p className="text-slate-500 leading-relaxed">
                遵循标准 OAuth 2.0 协议，无论是 Node.js、Python 还是 PHP
                都能在几分钟内完成对接。
              </p>
            </div>

            <div className="group p-8 border border-slate-100 rounded-[32px] bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                安全可靠
              </h3>
              <p className="text-slate-500 leading-relaxed">
                基于 JWT
                签名和加密传输，确保用户信息在不同站点间流转时的绝对安全。
              </p>
            </div>

            <div className="group p-8 border border-slate-100 rounded-[32px] bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500">
              <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                多端同步
              </h3>
              <p className="text-slate-500 leading-relaxed">
                用户只需登录一次，即可通行于您旗下的所有站点，极大降低流失率。
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-slate-50">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-12">
            Trusted by visionary developers
          </p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
            <div className="text-2xl font-black italic">Project A</div>
            <div className="text-2xl font-black italic">Project B</div>
            <div className="text-2xl font-black italic">Project C</div>
            <div className="text-2xl font-black italic">Project D</div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-20 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">
                S5
              </div>
              <span className="text-xl font-bold text-white tracking-tighter">
                auth
              </span>
            </div>
            <p className="max-w-sm leading-relaxed">
              致力于为个人开发者和中小型团队提供最简洁、最高效的 OAuth 2.0
              统一认证解决方案。
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">资源</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="/docs" className="hover:text-white transition-colors">
                  文档指南
                </a>
              </li>
              <li>
                <a
                  href="/test-client"
                  className="hover:text-white transition-colors"
                >
                  测试工具
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  开发者控制台
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">链接</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="https://github.com/Eternity-Sky/S5oauth"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://netlify.com"
                  className="hover:text-white transition-colors"
                >
                  Netlify
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-800 text-center text-xs">
          &copy; 2026 S5auth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
