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
    getRoles: builder.query({
      query: (orgId) => `/api/organization/${orgId}/roles`,
      providesTags: ['Role'],
    }),
    createRole: builder.mutation({
      query: ({ orgId, roleData }) => ({
        url: `/api/organization/${orgId}/roles`,
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    inviteUser: builder.mutation({
      query: ({ orgId, inviteData }) => ({
        url: `/api/organization/${orgId}/invite`,
        method: 'POST',
        body: inviteData,
      }),
      invalidatesTags: ['OrganizationUser'],
    }),
    joinOrg: builder.mutation({
      query: ({ orgSlug, preferredRoleId }) => ({
        url: `/api/organization/${orgSlug}/join`,
        method: 'POST',
        body: { preferredRoleId },
      }),
    }),
    getJoinRoles: builder.query({
      query: (orgSlug) => `/api/organization/${orgSlug}/join/roles`,
    }),
    getPendingMembers: builder.query({
      query: (orgId) => `/api/organization/${orgId}/members/pending`,
      providesTags: ['OrganizationUser'],
    }),
    getActiveMembers: builder.query({
      query: (orgId) => `/api/organization/${orgId}/members/active`,
      providesTags: ['OrganizationUser'],
    }),
    approveMember: builder.mutation({
      query: ({ orgId, userId, roleId }) => ({
        url: `/api/organization/${orgId}/members/${userId}/approve`,
        method: 'PATCH',
        body: { roleId },
      }),
      invalidatesTags: ['OrganizationUser'],
    }),
    rejectMember: builder.mutation({
      query: ({ orgId, userId }) => ({
        url: `/api/organization/${orgId}/members/${userId}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: ['OrganizationUser'],
    }),
    updateUserShift: builder.mutation({
      query: ({ orgSlug, userId, shiftData }) => ({
        url: `/api/organization/${orgSlug}/users/${userId}/shift`,
        method: 'PUT',
        body: shiftData,
      }),
      invalidatesTags: ['OrganizationUser'],
    }),
  }),
});

export const { 
  useGetOrganizationsQuery, 
  useCreateOrganizationMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useInviteUserMutation,
  useJoinOrgMutation,
  useGetJoinRolesQuery,
  useGetPendingMembersQuery,
  useGetActiveMembersQuery,
  useApproveMemberMutation,
  useRejectMemberMutation,
  useUpdateUserShiftMutation
} = organizationApi;
