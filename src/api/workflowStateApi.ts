import { baseApi } from './baseApi';

export const workflowStateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkflowStatesByBoard: builder.query({
      query: (boardId) => `/api/workflow-states/board/${boardId}`,
      providesTags: ['Board'],
    }),
    createWorkflowState: builder.mutation({
      query: (data) => ({
        url: '/api/workflow-states',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Board'],
    }),
  }),
});

export const {
  useGetWorkflowStatesByBoardQuery,
  useCreateWorkflowStateMutation,
} = workflowStateApi;
