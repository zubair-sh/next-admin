import { api } from "@/store/api";
import { PaginatedResponse } from "@/types";
import { ApiEndpoints } from "@/config/constants";
import { downloadBlob } from "@/lib/utils";
import {
  CreatePermissionRequest,
  ExportPermissionsParams,
  IPermission,
  PermissionsQueryParams,
  UpdatePermissionRequest,
} from "../types";

export const permissionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<
      PaginatedResponse<IPermission>,
      PermissionsQueryParams
    >({
      query: (params) => ({
        url: ApiEndpoints.PERMISSIONS,
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({
                type: "Permission" as const,
                id,
              })),
              { type: "Permissions", id: "LIST" },
            ]
          : [{ type: "Permissions", id: "LIST" }],
    }),

    getPermissionById: builder.query<IPermission, string | number>({
      query: (id) => ApiEndpoints.PERMISSION_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "Permission", id }],
    }),

    createPermission: builder.mutation<IPermission, CreatePermissionRequest>({
      query: (body) => ({
        url: ApiEndpoints.PERMISSIONS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Permissions", id: "LIST" }],
    }),

    updatePermission: builder.mutation<
      IPermission,
      { id: string | number; data: UpdatePermissionRequest }
    >({
      query: ({ id, data }) => ({
        url: ApiEndpoints.PERMISSION_BY_ID(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Permission", id },
        { type: "Permissions", id: "LIST" },
      ],
    }),

    deletePermission: builder.mutation<void, string | number>({
      query: (id) => ({
        url: ApiEndpoints.PERMISSION_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Permission", id },
        { type: "Permissions", id: "LIST" },
      ],
    }),

    exportPermissions: builder.mutation<
      { success: boolean },
      ExportPermissionsParams
    >({
      queryFn: async (params, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: ApiEndpoints.PERMISSIONS_EXPORT,
          params,
          responseHandler: async (response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        // Download the file
        const blob = result.data as Blob;
        const filename = `permissions-export.${params.format || "csv"}`;
        downloadBlob(blob, filename);

        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useLazyGetPermissionsQuery,
  useGetPermissionByIdQuery,
  useLazyGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useExportPermissionsMutation,
} = permissionsApi;
