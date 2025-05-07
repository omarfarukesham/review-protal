"use server";

import { IAuth } from "@/types/globals";
import { cookies } from "next/headers";

const backendUrl = process.env.AUTH_BACKEND_URL;
export const handleAuthentication = async (
  actionType: string,
  payload: IAuth
): Promise<{
  success: boolean;
  message: string;
  data?: {
    redirectUrl?: string;
    name?: string;
    role?: string;
    email?: string;
    photoUrl?: string;
  };
}> => {
  try {
    // Remove non-empty fields
    Object.keys(payload).forEach((key) => {
      if (!payload[key as keyof typeof payload]) {
        delete payload[key as keyof typeof payload];
      }
    });
    // console.log("Payload", payload);
    const api = `${backendUrl}/${
      actionType === "create" ? "user" : "auth"
    }/${actionType}`;
    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    // console.log("Auth result", result);
    if (actionType !== "register") {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
      });
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
      });
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Operation Failed");
  }
};
