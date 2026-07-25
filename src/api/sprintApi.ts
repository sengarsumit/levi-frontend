import { baseApi } from './baseApi';

export interface Sprint {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  projectId: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintRequest {
  name: string;
  startDate?: string;
  endDate?: string;
  projectId: number;
}

export interface UpdateSprintRequest {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  projectId: number;
}

export const sprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSprintsByProject: builder.query<Sprint[], number>({
      query: (projectId) => `/api/sprints/project/${projectId}`,
      providesTags: (_result, _error, projectId) => [{ type: 'Sprint', id: `PROJECT_${projectId}` }],
    }),
    createSprint: builder.mutation<Sprint, CreateSprintRequest>({
      query: (body) => ({
        url: '/api/sprints',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Sprint', id: `PROJECT_${projectId}` }],
    }),
    updateSprint: builder.mutation<Sprint, UpdateSprintRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/sprints/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Sprint', id: `PROJECT_${projectId}` }],
    }),
    deleteSprint: builder.mutation<void, { sprintId: number; projectId: number }>({
      query: ({ sprintId }) => ({
        url: `/api/sprints/${sprintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'Sprint', id: `PROJECT_${projectId}` }],
    }),
  }),
});

export const {
  useGetSprintsByProjectQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintApi;
