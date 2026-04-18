/**
 * S5auth Client SDK
 * Provides a simple way to integrate S5auth into any JavaScript/TypeScript application.
 */

export interface S5authConfig {
  /**
   * Your S5auth application Client ID.
   */
  clientId: string;
  /**
   * Your S5auth application Client Secret. (Only required for server-side token exchange)
   */
  clientSecret?: string;
  /**
   * The redirect URI configured in your S5auth dashboard.
   */
  redirectUri: string;
  /**
   * Optional custom base URL for S5auth (defaults to https://s5auth.netlify.app).
   */
  baseUrl?: string;
}

export interface S5authTokens {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface S5authUser {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}

export class S5authClient {
  private config: S5authConfig;
  private baseUrl: string;

  constructor(config: S5authConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://s5auth.netlify.app";
  }

  /**
   * Generates the authorization URL to redirect the user to.
   * @param state An optional state parameter to prevent CSRF.
   * @returns The full authorization URL.
   */
  getAuthorizationUrl(state?: string): string {
    const url = new URL("/api/oidc/authorize", this.baseUrl);
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", this.config.redirectUri);
    url.searchParams.set("response_type", "code");
    if (state) {
      url.searchParams.set("state", state);
    }
    return url.toString();
  }

  /**
   * Exchanges an authorization code for tokens.
   * This should typically be called on your server-side callback handler.
   * @param code The authorization code received from the callback.
   * @returns The access and ID tokens.
   */
  async exchangeCodeForTokens(code: string): Promise<S5authTokens> {
    if (!this.config.clientSecret) {
      throw new Error("clientSecret is required for token exchange.");
    }

    const response = await fetch(`${this.baseUrl}/api/oidc/token`, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to exchange code for tokens.");
    }

    return data as S5authTokens;
  }

  /**
   * Fetches user information using an access token.
   * @param accessToken The access token obtained from token exchange.
   * @returns The user's profile information.
   */
  async getUserInfo(accessToken: string): Promise<S5authUser> {
    const response = await fetch(`${this.baseUrl}/api/oidc/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user info.");
    }

    return data as S5authUser;
  }
}

/**
 * Convenience helper to create a client instance.
 */
export const createS5authClient = (config: S5authConfig) =>
  new S5authClient(config);
