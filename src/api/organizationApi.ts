import { baseApi } from './baseApi';

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => '/api/organization',
      providesTags: ['Organization'],
    }),
    createOrganization: builder.mutation({
      query: (orgData) => ({
        url: '/api/organization',
        method: 'POST',
        body: orgData,
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const { useGetOrganizationsQuery, useCreateOrganizationMutation } = organizationApi;
