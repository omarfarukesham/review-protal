"use server";

import { TPaymentPayload } from "@/types/globals";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getToken } from "../GlobalServices";

const backendUrl = process.env.AUTH_BACKEND_URL as string;

export const getSession = async (payload: {
  name: string;
  email: string;
  amount: number;
}) => {
  try {
    const res = await fetch(`${backendUrl}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to fetch payment");
  }
};

export const confirmPayment = async (
  // token: string,
  payload: TPaymentPayload
) => {
  try {
    const token = (await cookies()).get("accessToken")?.value as string;
    const res = await fetch(`${backendUrl}/payment/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result?.success) {
      revalidateTag("buyReview");
    }
    return result;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to buy review");
  }
};

export const getAllPayments = async () => {
  try {
    const res = await fetch(`${backendUrl}/payment`);
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to fetch payment");
  }
};

export const getPaymentById = async (id: string) => {
  try {
    const token = (await cookies()).get("accessToken")?.value as string;
    const res = await fetch(`${backendUrl}/payment/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to fetch payment");
  }
};

export const getUsersAllPayments = async (email: string) => {
  const token = await getToken();
  try {
    const res = await fetch(`${backendUrl}/payment/my-payments/${email}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to fetch payment");
  }
};

export const getPaymentHistory = async (email: string) => {
  try {
    if (!email) {
      throw new Error("Email is required to fetch payment history");
    }
    console.log("email", email);
    const token = await getToken();
    const response = await fetch(`${backendUrl}/payment/my-payments/${email}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    const result = await response.json();
    console.log("payment result", result);
    return result;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};
