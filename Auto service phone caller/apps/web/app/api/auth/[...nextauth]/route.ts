import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Use the internal Docker network URL when running server-side in the container,
// fall back to the public/base URL for local development in the browser.
const API_BASE = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        // Expecting { access_token, user: { id, email, name? }, default_shop_id? }
        if (!data?.access_token) return null;
        return {
          id: data.user?.id?.toString?.() || data.user?.id || data.email || credentials.email,
          name: data.user?.name || credentials.email,
          email: data.user?.email || credentials.email,
          accessToken: data.access_token,
          defaultShopId: data.default_shop_id || null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.defaultShopId = (user as any).defaultShopId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).defaultShopId = token.defaultShopId ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
