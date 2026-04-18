import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SecurityAuditPage() {
  const session = await auth();
  if (!session) redirect("/");

  const logs = await prisma.auditLog.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-[family-name:var(--font-geist-sans)]">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic text-sm">S5</div>
            <span className="font-bold text-slate-900 tracking-tighter">安全审计</span>
          </div>
          <a href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">返回控制台</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">安全活动</h1>
          <p className="text-slate-500">查看您账号最近的登录和授权记录。</p>
        </header>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              暂无活动记录。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-8 py-4">事件</th>
                    <th className="px-8 py-4">地点 (IP)</th>
                    <th className="px-8 py-4">设备 / 浏览器</th>
                    <th className="px-8 py-4 text-right">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            log.event === 'LOGIN' ? 'bg-blue-500' : 'bg-indigo-500'
                          }`}></div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {log.event === 'LOGIN' ? '账号登录' : 
                               log.event === 'OAUTH_AUTHORIZE' ? '应用授权' : log.event}
                            </p>
                            {log.details && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {JSON.parse(log.details).clientName || JSON.parse(log.details).provider}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {log.ip}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs text-slate-500 max-w-xs truncate" title={log.userAgent || ""}>
                          {log.userAgent}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-xs text-slate-400">
                          {new Date(log.createdAt).toLocaleString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
