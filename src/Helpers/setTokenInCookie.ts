"use server";
import { cookies } from "next/headers";

const setTokenInCookie = async (token: string, tokenName: string) => {
  if (token) {
    const cookieStore = await cookies();
    cookieStore.set(tokenName, token, {
      httpOnly: true,
    });
  }
};

export default setTokenInCookie;
