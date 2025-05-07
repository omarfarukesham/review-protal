/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidateTag } from "next/cache";
import { getToken } from "../GlobalServices";

const backend_url = process.env.AUTH_BACKEND_URL;

export const getReviews = async (query: any) => {
  try {
    // Fix typo and convert to Date if present
    if (query?.startDate || query?.endDate) {
      if (query?.startDate) {
        query.startDate = new Date(query.startDate).toISOString();
      }
      if (query?.endDate) {
        query.endDate = new Date(query.endDate).toISOString();
      }
    }

    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const res = await fetch(`${backend_url}/review?${queryString}`, {
      method: "GET",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};
export const getReviewCount = async () => {
  try {
    const res = await fetch(`${backend_url}/review/count`, {
      method: "GET",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error("Failed to fetch count");
  }
};

export const getReviewDetails = async (id: string, action?: string) => {
  try {
    const url = action
      ? `${backend_url}/review/${id}?action=${action}`
      : `${backend_url}/review/${id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();

    return result;
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};

export const getUnpublishedReviews = async () => {
  try {
    const token = await getToken();
    const res = await fetch(`${backend_url}/review/unpublished`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
      next: {
        tags: ["unpublished-reviews"],
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};

export const updateReviewStatus = async (
  reviewId: string,
  actionType: string,
  reason?: string
) => {
  try {
    const token = await getToken();
    const res = await fetch(
      `${backend_url}/review/${reviewId}?actionType=${actionType}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const result = await res.json();
    if (!res.ok) {
      throw new Error("Failed to update review");
    }
    revalidateTag("unpublished-reviews");
    return result;
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};

export const getMyReviews = async () => {
  try {
    const token = await getToken();
    const res = await fetch(`${backend_url}/review/my-reviews`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
      next: {
        tags: ["reviews"],
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};

export const createReview = async (payload: any) => {
  try {
    const token = await getToken();
    const res = await fetch(`${backend_url}/review/create`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: payload,
    });
    const result = await res.json();
    return result;
  } catch (error) {}
};
export const deleteReview = async (reviewId: string) => {
  try {
    const token = await getToken();
    const res = await fetch(`${backend_url}/review/delete/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    });
    const result = await res.json();
    if (result.success) {
      revalidateTag("reviews");
    }
    return result;
  } catch (error) {
    throw new Error("Failed to delete review");
  }
};
export const updateReview = async (payload: any, reviewId: string) => {
  try {
    const token = await getToken();
    const res = await fetch(`${backend_url}/review/update/${reviewId}`, {
      method: "PATCH",
      headers: {
        Authorization: `${token}`,
      },
      body: payload,
    });
    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update review");
  }
};
