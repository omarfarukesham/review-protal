"use server";
import { cookies } from "next/headers";

const deleteTokenFromCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export default deleteTokenFromCookie;
