import { baseApi } from './baseApi';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByIssue: builder.query({
      query: (issueId) => `/api/comments/issue/${issueId}`,
      providesTags: (_result, _error, issueId) => [{ type: 'Issue', id: `comments-${issueId}` }],
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: '/api/comments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'Issue', id: `comments-${issueId}` }],
    }),
    updateComment: builder.mutation({
      query: ({ id, comment, issueId }) => ({
        url: `/api/comments/${id}`,
        method: 'PUT',
        body: { comment },
        // issueId used only for cache invalidation below
        _issueId: issueId,
      }),
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'Issue', id: `comments-${issueId}` }],
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({
        url: `/api/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'Issue', id: `comments-${issueId}` }],
    }),
  }),
});

export const {
  useGetCommentsByIssueQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
