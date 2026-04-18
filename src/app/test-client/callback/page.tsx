"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TestCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      setError("未能在 URL 中找到授权码 (code)");
      return;
    }

    const exchangeToken = async () => {
      try {
        const clientId = localStorage.getItem("test_client_id");
        const clientSecret = localStorage.getItem("test_client_secret");
        const redirectUri = localStorage.getItem("test_redirect_uri");

        if (!clientId || !clientSecret || !redirectUri) {
          throw new Error("本地缓存中缺失 Client 凭据，请重新从测试首页开始。");
        }

        // 1. 交换令牌
        const tokenRes = await fetch("/api/oidc/token", {
          method: "POST",
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error || "令牌交换失败");

        // 2. 获取用户信息
        const userRes = await fetch("/api/oidc/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.error || "获取用户信息失败");

        setData({ tokens: tokenData, user: userData });
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setError(err.message);
      }
    };

    exchangeToken();
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">测试回调结果</h1>
        <a href="/test-client" className="text-blue-600 hover:underline">
          返回测试页
        </a>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-3 p-8 bg-white rounded-2xl border shadow-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p>正在与 S5auth 通信，请稍候...</p>
        </div>
      )}

      {status === "error" && (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-700">
          <h2 className="font-bold text-lg mb-2">测试失败</h2>
          <p className="font-mono text-sm bg-white/50 p-4 rounded-lg">
            {error}
          </p>
        </div>
      )}

      {status === "success" && data && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-green-500 text-white p-1 rounded-full text-xs">
              ✓
            </div>
            <p className="text-green-800 font-bold">认证流程已成功完成！</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">
                用户信息 (UserInfo)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {data.user.picture && (
                    <img
                      src={data.user.picture}
                      className="w-12 h-12 rounded-full border"
                      alt="Avatar"
                    />
                  )}
                  <div>
                    <p className="font-bold text-lg">{data.user.name}</p>
                    <p className="text-sm text-gray-500">{data.user.email}</p>
                  </div>
                </div>
                <pre className="bg-gray-50 p-4 rounded-xl text-xs overflow-auto max-h-48 font-mono">
                  {JSON.stringify(data.user, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">
                令牌详情 (Tokens)
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">
                    Access Token
                  </p>
                  <p className="font-mono text-[10px] break-all bg-gray-50 p-2 rounded border">
                    {data.tokens.access_token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">
                    ID Token
                  </p>
                  <p className="font-mono text-[10px] break-all bg-gray-50 p-2 rounded border">
                    {data.tokens.id_token}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-8 bg-white rounded-2xl border shadow-sm">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p>加载中...</p>
            </div>
          </div>
        }
      >
        <TestCallbackContent />
      </Suspense>
    </div>
  );
}
