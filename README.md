# S5auth - 轻量级 OAuth 2.0 身份认证服务

S5auth 是一个基于 Next.js 和 Prisma 构建的无服务器（Serverless）身份认证提供商，旨在为多个关联网站提供统一的登录体验。它支持 OAuth 2.0 / OIDC 协议，并完美适配 Netlify 部署。

## 🚀 核心特性

- **统一登录**：基于 GitHub OAuth 实现用户初次登录。
- **开发者控制台**：自助创建和管理 OAuth 客户端（Client ID / Client Secret）。
- **标准协议支持**：
  - 授权码流程 (Authorization Code Grant)
  - 授权端点: `/api/oidc/authorize`
  - 令牌端点: `/api/oidc/token`
  - 用户信息: `/api/oidc/userinfo`
- **无服务器架构**：适配主流边缘计算平台，配合 Prisma Postgres 实现极速响应。

## 🛠️ 技术栈

- **框架**: Next.js 15+ (App Router)
- **数据库**: Prisma + Postgres (Edge-ready)
- **认证**: Auth.js (NextAuth v5)
- **样式**: Tailwind CSS
- **部署**: Netlify

## 📦 部署指南

### 选项 A: Netlify (默认)

1. **克隆仓库**:

   ```bash
   git clone https://github.com/Eternity-Sky/S5oauth.git
   ```

2. **环境变量**:
   在 Netlify 后台配置以下变量：
   - `DATABASE_URL`: Postgres 连接字符串。
   - `AUTH_SECRET`: 用于会话加密的随机字符串。
   - `GITHUB_ID` / `GITHUB_SECRET`: GitHub OAuth 应用凭据。
   - `AUTH_TRUST_HOST`: `true`

3. **初始化数据库**:
   ```bash
   npx prisma db push
   ```

## 📦 集成方式

### 官方 SDK (推荐)

最简单的方式是使用我们的官方 SDK：

```bash
npm install @sqrt5/s5auth-sdk
```

使用示例：

```typescript
import { createS5authClient } from "@sqrt5/s5auth-sdk";

const s5auth = createS5authClient({
  clientId: "YOUR_CLIENT_ID",
  redirectUri: "https://your-site.com/callback",
});

// 1. 获取授权链接
const authUrl = s5auth.getAuthorizationUrl("state");

// 2. 在回调中交换令牌
const tokens = await s5auth.exchangeCodeForTokens(code);

// 3. 获取用户信息
const user = await s5auth.getUserInfo(tokens.access_token);
```

### 标准 API

详细的集成步骤和代码示例，请访问已部署站点的 `/docs` 页面。

---

Built with ❤️ by S5auth Team
