"use client";

import { AppRoutes } from "@/config/constants";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip, Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AppDialog, DataTable, FilterConfig } from "@/components/ui";
import { PaginatedResponse } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDialog, useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { IUser } from "@/features/users/types";
import { useDeleteUserMutation } from "@/features/users/api";
import { PERMISSIONS } from "@/config/constants/permissions";

interface UserTableProps {
  data?: PaginatedResponse<IUser>;
  isLoading: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
}

export function UserTable({ data, isLoading }: UserTableProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { can } = usePermission();
  const deleteDialog = useDialog<string | number>();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleView = useCallback(
    (id: string | number) => {
      router.push(AppRoutes.USER_DETAIL(String(id)));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string | number) => {
      router.push(`${AppRoutes.USER_DETAIL(String(id))}?edit=true`);
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
      await deleteUser(deleteDialog.data);
      deleteDialog.handleClose();
    }
  };

  const columns: GridColDef<IUser>[] = useMemo(
    () => [
      {
        field: "email",
        headerName: t("common.email"),
        flex: 1,
      },
      {
        field: "fullName",
        headerName: t("common.full_name"),
        flex: 1,
        renderCell: (params: GridRenderCellParams<IUser>) =>
          params.row.fullName || "—",
      },
      {
        field: "role",
        headerName: t("common.role"),
        width: 150,
        renderCell: (params: GridRenderCellParams<IUser>) =>
          params.row.role?.name || "—",
      },
      {
        field: "status",
        headerName: t("common.status"),
        width: 120,
        renderCell: (params: GridRenderCellParams<IUser>) => {
          const statusColors = {
            active: "success",
            inactive: "warning",
            deleted: "error",
          } as const;
          return (
            <Chip
              label={t(`common.${params.row.status}`)}
              color={statusColors[params.row.status]}
              size="small"
            />
          );
        },
      },
      {
        field: "createdAt",
        headerName: t("common.created_at"),
        width: 120,
        renderCell: (params: GridRenderCellParams<IUser>) =>
          formatDate(params.row.createdAt),
      },
      {
        field: "actions",
        headerName: "",
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IUser>) => (
          <Stack direction="row" spacing={0.5}>
            {can(PERMISSIONS.USERS.READ) && (
              <Tooltip title={t("common.view") || "View"}>
                <IconButton
                  size="small"
                  onClick={() => handleView(params.row.id)}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.USERS.UPDATE) && (
              <Tooltip title={t("common.edit") || "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(params.row.id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.USERS.DELETE) && (
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

  const filters: FilterConfig[] = useMemo(
    () => [
      {
        name: "status",
        label: "Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "deleted", label: "Deleted" },
        ],
      },
    ],
    [],
  );

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
        title={t("users.delete_confirmation_title")}
        message={t("users.delete_confirmation_message")}
        onConfirm={handleDeleteConfirm}
        onClose={deleteDialog.handleClose}
        isConfirming={isDeleting}
      />
    </>
  );
}
