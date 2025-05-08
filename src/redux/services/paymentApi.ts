// src/redux/services/reviewApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://backend-server-review-portal.vercel.app/api/v1/payment`,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getMyPayments: builder.query({
      query: (email:string) => `my-payments/${email}`,
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetMyPaymentsQuery } = paymentApi;
