# S5auth SDK for JavaScript/TypeScript

The official S5auth client SDK for seamless OAuth 2.0 / OIDC integration.

## Installation

```bash
npm install @sqrt5/s5auth-sdk
```

## Quick Start

### 1. Initialize the Client

```typescript
import { createS5authClient } from '@sqrt5/s5auth-sdk';

const s5auth = createS5authClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET', // Only required for server-side token exchange
  redirectUri: 'https://your-site.com/callback'
});
```

### 2. Redirect to Authorization URL

On your frontend:

```typescript
const login = () => {
  const authUrl = s5auth.getAuthorizationUrl('optional_state');
  window.location.href = authUrl;
};
```

### 3. Exchange Code for Tokens

In your callback handler (server-side):

```typescript
// Assuming you received the 'code' from query parameters
const { access_token, id_token } = await s5auth.exchangeCodeForTokens(code);

// Get user profile information
const user = await s5auth.getUserInfo(access_token);
console.log('User Profile:', user);
```

## Features

- **OAuth 2.0 / OIDC Standard Compliant**
- **Lightweight**: Zero dependencies (uses native `fetch`).
- **Fully Typed**: Written in TypeScript with full type support.
- **Cross-platform**: Works in Node.js, browsers, and Edge runtimes.

## License

MIT
