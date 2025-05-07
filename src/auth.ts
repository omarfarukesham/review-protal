/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import setTokenInCookie from "./Helpers/setTokenInCookie";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        photoUrl: { label: "Photo URL", type: "text" },
        isPreAuthenticated: { label: "Pre-authenticated", type: "text" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials): Promise<any> {
        try {
          // Check if this is our pre-authenticated flow
          if (credentials?.isPreAuthenticated === "true" && credentials.email) {
            // Create user object with all required fields
            return {
              id: credentials.email as string, // Ensure id is explicitly a string
              email: credentials.email,
              name: credentials.name,
              role: credentials.role,
              photoUrl: credentials.photoUrl || "",
              token: credentials.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  debug: true,
  callbacks: {
    signIn: async ({ profile, account, user }) => {
      if (account?.provider !== "credentials") {
        const payload = {
          email: profile?.email,
          name: profile?.name,
          profilePicture: profile?.picture,
          provider: account?.provider,
          googleRefreshToken: account?.refresh_token,
          googleAccessToken: account?.access_token,
          googleAccessTokenExpiry: account?.expires_at,
        };
        // Fetch the user's data from database
        try {
          const res = await fetch(
            `${process.env.AUTH_BACKEND_URL!}/auth/social-login`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          const result = await res.json();
          user.role = result?.data?.role;
          // Set the access and refresh token in cookies
          setTokenInCookie(result?.data?.googleAccessToken, "accessToken");
          setTokenInCookie(result?.data?.googleRefreshToken, "refreshToken");
        } catch (error) {
          console.error(error);
        }
      }
      return true;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.googleAccessToken = user.googleAccessToken;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});