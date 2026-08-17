import { baseApi } from './baseApi';

export interface ProjectMember {
  userId: string;
  createdAt?: string;
}

export const projectMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectMembers: builder.query<ProjectMember[], number>({
      query: (projectId) => `/api/projects/${projectId}/members`,
      providesTags: (_result, _error, projectId) => [{ type: 'ProjectMember', id: projectId }],
    }),
    addProjectMember: builder.mutation<ProjectMember, { projectId: number; userId: string }>({
      query: ({ projectId, userId }) => ({
        url: `/api/projects/${projectId}/members`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'ProjectMember', id: projectId },
        'Project',
      ],
    }),
    removeProjectMember: builder.mutation<void, { projectId: number; userId: string }>({
      query: ({ projectId, userId }) => ({
        url: `/api/projects/${projectId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'ProjectMember', id: projectId },
        'Project',
      ],
    }),
  }),
});

export const {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectMemberApi;
