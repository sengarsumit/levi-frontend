import { baseApi } from './baseApi';
import type { User } from '../types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/api/users',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
