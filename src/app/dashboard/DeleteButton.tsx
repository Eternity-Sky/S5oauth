"use client";

import { deleteOAuthClient } from "../actions/oauth";

export function DeleteButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const handleDelete = async () => {
    if (confirm(`确定要删除应用 "${clientName}" 吗？此操作不可撤销，且会导致使用该凭据的网站无法登录。`)) {
      try {
        await deleteOAuthClient(clientId);
      } catch (err) {
        alert("删除失败，请稍后重试。");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
    >
      删除应用
    </button>
  );
}
