"use client";

import { useState, useEffect } from "react";

export default function TestClientPage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");

  useEffect(() => {
    // Load saved test credentials
    setClientId(localStorage.getItem("test_client_id") || "");
    setClientSecret(localStorage.getItem("test_client_secret") || "");
    const defaultRedirect = typeof window !== "undefined" 
      ? `${window.location.origin}/test-client/callback`
      : "";
    setRedirectUri(localStorage.getItem("test_redirect_uri") || defaultRedirect);
  }, []);

  const handleStartTest = () => {
    // Save to local storage for the callback page
    localStorage.setItem("test_client_id", clientId);
    localStorage.setItem("test_client_secret", clientSecret);
    localStorage.setItem("test_redirect_uri", redirectUri);

    const authUrl = new URL("/api/oidc/authorize", window.location.origin);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", "test_state_123");

    window.location.href = authUrl.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">S5auth 服务测试工具</h1>
        <p className="text-gray-600 mb-8">
          此页面模拟一个第三方网站，用于测试您的 S5auth 认证流程是否正常。
        </p>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              第一步：在控制台创建应用并填入以下信息
            </label>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Client ID</p>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="从控制台复制 Client ID"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client Secret</p>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="从控制台复制 Client Secret"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Redirect URI (需在应用设置中允许)</p>
                <input
                  type="text"
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartTest}
              disabled={!clientId || !clientSecret}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-300"
            >
              开始测试登录流程
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-blue-800">
          <h3 className="font-bold mb-2">测试说明：</h3>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>点击按钮后，您将被重定向到 S5auth 的授权页面。</li>
            <li>授权成功后，S5auth 会带回一个 code。</li>
            <li>本页面会自动在后台调用 /api/oidc/token 交换令牌，并展示结果。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
