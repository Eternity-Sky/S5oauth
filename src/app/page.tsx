import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-black tracking-tighter">
          S5<span className="text-blue-600">auth</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          一个为您姐其他网站提供的简单、安全的身份认证服务。
        </p>
      </header>

      <main className="flex flex-col gap-6 items-center">
        {session ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">
              欢迎回来,{" "}
              <span className="font-bold">
                {session.user?.name || session.user?.email}
              </span>
              !
            </p>
            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="rounded-full bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition"
              >
                进入控制台
              </a>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 transition"
                >
                  退出登录
                </button>
              </form>
            </div>
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
              className="rounded-full bg-black text-white px-10 py-4 text-lg font-bold hover:bg-gray-800 transition shadow-xl"
            >
              通过 GitHub 登录
            </button>
          </form>
        )}
      </main>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-12">
        <div className="p-6 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-2">简单集成</h3>
          <p className="text-gray-600">
            只需几行代码，即可为您的网站添加 S5auth 登录。
          </p>
        </div>
        <div className="p-6 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-2">安全可靠</h3>
          <p className="text-gray-600">
            基于 OAuth 2.0 标准，保护用户隐私和数据安全。
          </p>
        </div>
        <div className="p-6 border rounded-2xl bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-2">多端同步</h3>
          <p className="text-gray-600">
            一个账号，通行于所有接入 S5auth 的网站。
          </p>
        </div>
      </section>
    </div>
  );
}
