import { api } from "@/store/api";
import { PaginatedResponse } from "@/types";
import { ApiEndpoints } from "@/config/constants";
import { downloadBlob } from "@/lib/utils";
import {
  CreateUserRequest,
  ExportUsersParams,
  IUser,
  UsersQueryParams,
  UpdateUserRequest,
} from "../types";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<IUser>, UsersQueryParams>({
      query: (params) => ({
        url: ApiEndpoints.USERS,
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<IUser, string | number>({
      query: (id) => ApiEndpoints.USER_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<IUser, CreateUserRequest>({
      query: (body) => ({
        url: ApiEndpoints.USERS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      IUser,
      { id: string | number; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: ApiEndpoints.USER_BY_ID(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: ApiEndpoints.USER_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    exportUsers: builder.mutation<{ success: boolean }, ExportUsersParams>({
      queryFn: async (params, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: ApiEndpoints.USERS_EXPORT,
          params,
          responseHandler: async (response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        // Download the file
        const blob = result.data as Blob;
        const filename = `users-export.${params.format || "csv"}`;
        downloadBlob(blob, filename);

        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useExportUsersMutation,
} = usersApi;
