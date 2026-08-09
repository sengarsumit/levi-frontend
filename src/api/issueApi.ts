import { baseApi } from './baseApi';
import type { Issue } from '../types';

export const issueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssuesByProject: builder.query<Issue[], number>({
      query: (projectId) => `/api/issues/project/${projectId}`,
      providesTags: ['Issue'],
    }),
    getBacklogIssuesByProject: builder.query<Issue[], number>({
      query: (projectId) => `/api/issues/project/${projectId}/backlog`,
      providesTags: ['Issue'],
    }),
    getIssuesByBoard: builder.query<Issue[], number>({
      query: (boardId) => `/api/issues/board/${boardId}`,
      providesTags: ['Issue'],
    }),
    getIssueById: builder.query<Issue, number>({
      query: (id) => `/api/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
    }),
    createIssue: builder.mutation<Issue, Partial<Issue>>({
      query: (issueData) => ({
        url: '/api/issues',
        method: 'POST',
        body: issueData,
      }),
      invalidatesTags: ['Issue'],
    }),
    updateIssue: builder.mutation<Issue, Partial<Issue>>({
      query: ({ id, ...patch }) => ({
        url: `/api/issues/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Issue'],
    }),
    moveIssue: builder.mutation<Issue, { id: number; workflowStateId: number }>({
      query: ({ id, workflowStateId }) => ({
        url: `/api/issues/${id}/move`,
        method: 'PATCH',
        body: { workflowStateId },
      }),
      invalidatesTags: ['Issue'],
    }),
    assignIssue: builder.mutation<Issue, { id: number; assignedTo: string | null }>({
      query: ({ id, assignedTo }) => ({
        url: `/api/issues/${id}/assign`,
        method: 'PATCH',
        body: { assignedTo },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Issue', { type: 'Issue', id }],
    }),
    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `/api/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issue'],
    }),
  }),
});

export const {
  useGetIssuesByProjectQuery,
  useGetBacklogIssuesByProjectQuery,
  useGetIssuesByBoardQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useMoveIssueMutation,
  useAssignIssueMutation,
  useDeleteIssueMutation,
} = issueApi;
