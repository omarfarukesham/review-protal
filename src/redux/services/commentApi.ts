// src/redux/services/commentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  articleId: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateCommentPayload {
  articleId: string;
  content: string;
}

interface UpdateCommentPayload {
  commentId: string;
  content: string;
}

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://backend-server-review-portal.vercel.app/api/v1/comment/`,
    prepareHeaders: (headers) => {
      const token = localStorage.get('accessToken')
      // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXNhIiwiZW1haWwiOiJqb3Vqb25pa2lhc2Fyb3kub2ZmaWNpYWxAZ21haWwuY29tIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjM2MTQ2OSwiZXhwIjoxNzQ2NDQ3ODY5fQ.Wk1PDs_0fiwdnvQq0clQH1qlAnlTl22FsakYxBVETKQ";
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    // Get all comments for an article
    getComments: builder.query<Comment[], string>({
      query: (articleId) => `${articleId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: 'LIST' },
            ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),

    // Create a new comment
    createComment: builder.mutation<Comment, CreateCommentPayload>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
    }),

    // Update a comment
    updateComment: builder.mutation<Comment, UpdateCommentPayload>({
      query: ({ commentId, content }) => ({
        url: `${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: commentId },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: 'Comment', id: commentId },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;