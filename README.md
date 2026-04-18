# S5auth - 轻量级 OAuth 2.0 身份认证服务

S5auth 是一个基于 Next.js 和 Prisma 构建的无服务器（Serverless）身份认证提供商，旨在为多个关联网站提供统一的登录体验。它支持 OAuth 2.0 / OIDC 协议，并完美适配 Netlify, Cloudflare 和 EdgeOne 部署。

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
- **部署**: Netlify / Cloudflare Pages / Tencent Cloud EdgeOne

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

### 选项 B: Cloudflare Pages (CDN & 边缘计算)

S5auth 完美支持 Cloudflare Pages 部署，利用 Cloudflare CDN 提供全球加速和安全防护。

1. **安装依赖**:

   ```bash
   npm install
   ```

2. **构建与预览**:

   ```bash
   npm run deploy
   ```

3. **Cloudflare 配置**:
   - 在 Cloudflare Pages 后台，将 **Build command** 设置为 `npm run pages:build`。
   - 将 **Build output directory** 设置为 `.vercel/output`。
   - 在 **Settings -> Functions -> Compatibility flags** 中添加 `nodejs_compat`。
   - 配置与 Netlify 相同的环境变量。

### 选项 C: 腾讯云 EdgeOne (全球加速 & 边缘计算)

S5auth 现已支持腾讯云 EdgeOne Pages 部署，为您提供国内及全球范围内的超低延迟认证体验。

1. **连接 Git 仓库**:
   - 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone/zones)。
   - 进入 **Pages** 页面，点击 **创建项目** 并连接您的 GitHub 仓库。

2. **构建配置**:
   - **框架预设**: `Next.js` (EdgeOne 会自动识别)。
   - **构建命令**: `npm run edgeone:build`。
   - **输出目录**: 保持默认 (通常为 `.next` 或自动检测)。

3. **环境变量**:
   - 在 EdgeOne 项目设置中添加与 Netlify 相同的环境变量。

4. **数据库建议**:
   在边缘计算环境（Edge Runtime）下，建议使用 [Neon](https://neon.tech/) 或 [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) 以获得最佳性能。

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
