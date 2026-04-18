import GitHub from "next-auth/providers/github";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { NextAuthConfig } from "next-auth";

export default {
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
        ? `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`
        : undefined,
    }),
  ],
  events: {
    async signIn({ user }) {
      // Temporarily disabled to debug initialization error
      console.log("User signed in:", user.id);
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      }
      return true;
    },
    session({ session, user, token }) {
      if (session.user && (user?.id || token?.sub)) {
        session.user.id = user?.id || (token?.sub as string);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
