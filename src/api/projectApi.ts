import { baseApi } from './baseApi';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (organizationId) => `/api/projects/organization/${organizationId}`,
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => `/api/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/api/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const { 
  useGetProjectsQuery, 
  useGetProjectByIdQuery, 
  useCreateProjectMutation 
} = projectApi;
