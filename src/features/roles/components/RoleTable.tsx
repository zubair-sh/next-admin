"use client";

import { AppRoutes } from "@/config/constants";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AppDialog, DataTable, FilterConfig } from "@/components/ui";
import { PaginatedResponse } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDialog, useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { IRole } from "@/features/roles/types";
import { useDeleteRoleMutation } from "@/features/roles/api";
import { PERMISSIONS } from "@/config/constants/permissions";

interface RoleTableProps {
  data?: PaginatedResponse<IRole>;
  isLoading: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
}

export function RoleTable({ data, isLoading }: RoleTableProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { can } = usePermission();
  const deleteDialog = useDialog<string | number>();

  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const handleView = useCallback(
    (id: string | number) => {
      router.push(AppRoutes.ROLE_DETAIL(String(id)));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string | number) => {
      router.push(`${AppRoutes.ROLE_DETAIL(String(id))}?edit=true`);
    },
    [router],
  );

  const handleDeleteClick = useCallback(
    (id: string | number) => {
      deleteDialog.handleOpen(id);
    },
    [deleteDialog],
  );

  const handleDeleteConfirm = async () => {
    if (deleteDialog.data) {
      await deleteRole(deleteDialog.data);
      deleteDialog.handleClose();
    }
  };

  const columns: GridColDef<IRole>[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("common.name"),
        width: 200,
      },
      {
        field: "description",
        headerName: t("common.description"),
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: t("common.created_at"),
        width: 120,
        renderCell: (params: GridRenderCellParams<IRole>) =>
          formatDate(params.row.createdAt),
      },
      {
        field: "actions",
        headerName: "",
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IRole>) => (
          <Stack direction="row" spacing={0.5}>
            {can(PERMISSIONS.ROLES.READ) && (
              <Tooltip title={t("common.view") || "View"}>
                <IconButton
                  size="small"
                  onClick={() => handleView(params.row.id)}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.ROLES.UPDATE) && (
              <Tooltip title={t("common.edit") || "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(params.row.id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.ROLES.DELETE) && (
              <Tooltip title={t("common.delete") || "Delete"}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(params.row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
      },
    ],
    [t, can, handleView, handleEdit, handleDeleteClick],
  );

  const filters: FilterConfig[] = useMemo(() => [], []);

  return (
    <>
      <DataTable
        rows={data?.items}
        columns={columns}
        rowCount={data?.totalCount || 0}
        paginationModel={{
          page: (data?.page || 1) - 1,
          pageSize: data?.pageSize || 10,
        }}
        loading={isLoading || isDeleting}
        pageSizeOptions={[10, 25, 50]}
        paginationMode="server"
        enableSearch
        searchPlaceholder={t("common.search")}
        filters={filters}
      />
      <AppDialog
        open={deleteDialog.open}
        title={t("roles.delete_confirmation_title")}
        message={t("roles.delete_confirmation_message")}
        onConfirm={handleDeleteConfirm}
        onClose={deleteDialog.handleClose}
        isConfirming={isDeleting}
      />
    </>
  );
}
