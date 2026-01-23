import { api } from "@/store/api";
import { PaginatedResponse } from "@/types";
import { ApiEndpoints } from "@/config/constants";
import {
  CreateRoleRequest,
  ExportRolesParams,
  IRole,
  RolesQueryParams,
  UpdateRoleRequest,
} from "../types";
import { downloadBlob } from "@/lib/utils";

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<PaginatedResponse<IRole>, RolesQueryParams>({
      query: (params) => ({
        url: ApiEndpoints.ROLES,
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({
                type: "Role" as const,
                id,
              })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),

    getRoleById: builder.query<IRole, string | number>({
      query: (id) => ApiEndpoints.ROLE_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<IRole, CreateRoleRequest>({
      query: (body) => ({
        url: ApiEndpoints.ROLES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: builder.mutation<
      IRole,
      { id: string | number; data: UpdateRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: ApiEndpoints.ROLE_BY_ID(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Role", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation<void, string | number>({
      query: (id) => ({
        url: ApiEndpoints.ROLE_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Role", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    exportRoles: builder.mutation<{ success: boolean }, ExportRolesParams>({
      queryFn: async (params, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: ApiEndpoints.ROLES_EXPORT,
          params,
          responseHandler: async (response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        // Download the file
        const blob = result.data as Blob;
        const filename = `roles-export.${params.format || "csv"}`;
        downloadBlob(blob, filename);

        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetRoleByIdQuery,
  useLazyGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useExportRolesMutation,
} = rolesApi;
