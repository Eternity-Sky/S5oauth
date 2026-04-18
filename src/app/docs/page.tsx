export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-blue-600">S5auth Docs</span>
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            返回首页
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tight">集成指南</h1>
          <p className="text-lg text-gray-600">
            欢迎使用
            S5auth。本指南将帮助您在几分钟内为您的网站接入统一身份认证。
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              推荐
            </div>
            <p className="text-sm text-blue-800">
              使用我们的官方 <strong>SDK</strong> 可以更快速地完成集成。
            </p>
          </div>
        </section>

        <section className="space-y-12">
          {/* SDK Section */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-slate-100 shadow-2xl shadow-blue-900/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                📦 使用官方 SDK (推荐)
              </h2>
              <div className="flex gap-2">
                <a
                  href="https://www.npmjs.com/package/@sqrt5/s5auth-sdk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://img.shields.io/npm/v/@sqrt5/s5auth-sdk.svg?style=flat-square"
                    alt="NPM Version"
                  />
                </a>
                <a
                  href="https://www.npmjs.com/package/@sqrt5/s5auth-sdk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://img.shields.io/npm/dm/@sqrt5/s5auth-sdk.svg?style=flat-square"
                    alt="NPM Downloads"
                  />
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-sm mb-3 font-bold uppercase tracking-wider">
                  安装
                </p>
                <pre className="bg-black/50 p-4 rounded-xl text-blue-400 font-mono text-sm">
                  npm install @sqrt5/s5auth-sdk
                </pre>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-3 font-bold uppercase tracking-wider">
                  初始化 & 登录
                </p>
                <pre className="bg-black/50 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto">
                  {`import { createS5authClient } from '@sqrt5/s5auth-sdk';

const s5auth = createS5authClient({
  clientId: 'YOUR_CLIENT_ID',
  redirectUri: 'https://your-site.com/callback'
});

// 引导用户去登录
const login = () => {
  window.location.href = s5auth.getAuthorizationUrl('optional_state');
};`}
                </pre>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-3 font-bold uppercase tracking-wider">
                  后端回调处理
                </p>
                <pre className="bg-black/50 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto">
                  {`import { createS5authClient } from '@sqrt5/s5auth-sdk';

// 在您的回调路由中 (如 /api/callback)
const s5auth = createS5authClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'https://your-site.com/callback'
});

const { access_token } = await s5auth.exchangeCodeForTokens(code);
const user = await s5auth.getUserInfo(access_token);
console.log('欢迎回来,', user.name);`}
                </pre>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
                或者使用标准 API
              </span>
            </div>
          </div>

          {/* Step 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              获取凭据
            </h2>
            <p className="text-gray-600 mb-4">
              首先，登录 S5auth 并进入{" "}
              <a href="/dashboard" className="text-blue-600 underline">
                控制台
              </a>{" "}
              创建一个新应用。您将获得：
            </p>
            <ul className="list-disc list-inside bg-gray-50 p-4 rounded-xl space-y-2 text-sm font-mono text-gray-700">
              <li>Client ID</li>
              <li>Client Secret</li>
            </ul>
            <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
              ⚠️ 确保在应用设置中正确配置了您的 <strong>Redirect URI</strong>{" "}
              (回调地址)。
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              引导用户登录
            </h2>
            <p className="text-gray-600 mb-4">
              将用户重定向到我们的授权端点，并带上您的参数：
            </p>
            <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed shadow-lg">
              {`GET https://s5a.netlify.app/api/oidc/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  state=RANDOM_STRING`}
            </pre>
          </div>

          {/* Step 3 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              换取令牌
            </h2>
            <p className="text-gray-600 mb-4">
              用户授权后，我们会将其重定向回您的回调地址并附带 <code>code</code>
              。您需要在后端使用此 code 换取 <code>access_token</code>：
            </p>
            <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed shadow-lg">
              {`POST https://s5a.netlify.app/api/oidc/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=USER_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=YOUR_REDIRECT_URI`}
            </pre>
          </div>

          {/* Step 4 */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                4
              </span>
              获取用户信息
            </h2>
            <p className="text-gray-600 mb-4">
              最后，使用 <code>access_token</code> 获取用户的公开资料：
            </p>
            <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed shadow-lg">
              {`GET https://s5a.netlify.app/api/oidc/userinfo
Authorization: Bearer YOUR_ACCESS_TOKEN`}
            </pre>
            <div className="mt-4 bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400 mb-2 uppercase font-bold">
                响应示例
              </p>
              <pre className="text-xs font-mono text-gray-700">
                {`{
  "sub": "user_id",
  "name": "张三",
  "email": "zhangsan@example.com",
  "picture": "https://..."
}`}
              </pre>
            </div>
          </div>
        </section>

        <hr className="my-16" />

        <section className="text-center">
          <h3 className="text-xl font-bold mb-4">准备好开始了吗？</h3>
          <div className="flex justify-center gap-4">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              去创建应用
            </a>
            <a
              href="/test-client"
              className="bg-white border px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition"
            >
              使用测试工具
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 mt-24">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-400 text-sm">
          &copy; 2026 S5auth Service. 标准 OAuth 2.0 实现.
        </div>
      </footer>
    </div>
  );
}
