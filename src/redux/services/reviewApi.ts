// src/redux/services/reviewApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Review {
  id: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  user: {
    name: string;
  };
  imageUrl: string;
  category: string;
  RatingSummary: number;
  isPremium: boolean;
  price: number;
  createdAt: string;
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://backend-server-review-portal.vercel.app/api/v1/review`,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    updateVote: builder.mutation<
      Review,
      {
        reviewId: string;
        voteType: "upVotes" | "downVotes";
      }>({
      query: ({ reviewId, voteType }) => ({
        url: `update-vote/${reviewId}?voteType=${voteType}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review"],
    }),
    getReview: builder.query<Review, string>({
      query: (id) => `${id}`,
      providesTags: ["Review"],
    }),
  }),
});

export const { useUpdateVoteMutation, useGetReviewQuery } = reviewApi;
