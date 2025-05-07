import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    googleAccessToken?: string;
    token?: string;
  }
  interface Session {
    user: {
      role: string;
      googleAccessToken?: string;
      token?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    googleAccessToken?: string;
    token?: string;
  }
}
