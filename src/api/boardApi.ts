import { baseApi } from './baseApi';

export const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoardsByProject: builder.query({
      query: (projectId) => `/api/boards/project/${projectId}`,
      providesTags: ['Board'],
    }),
    getBoardById: builder.query({
      query: (id) => `/api/boards/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Board', id }],
    }),
    createBoard: builder.mutation({
      query: (boardData) => ({
        url: '/api/boards',
        method: 'POST',
        body: boardData,
      }),
      invalidatesTags: ['Board'],
    }),
    updateBoard: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/api/boards/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Board'],
    }),
    deleteBoard: builder.mutation({
      query: (id) => ({
        url: `/api/boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Board'],
    }),
  }),
});

export const {
  useGetBoardsByProjectQuery,
  useGetBoardByIdQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi;
