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
import { IPermission } from "@/features/permissions/types";
import { useDeletePermissionMutation } from "@/features/permissions/api";
import { PERMISSIONS } from "@/config/constants/permissions";

interface PermissionTableProps {
  data?: PaginatedResponse<IPermission>;
  isLoading: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
}

export function PermissionTable({ data, isLoading }: PermissionTableProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { can } = usePermission();
  const deleteDialog = useDialog<string | number>();

  const [deletePermission, { isLoading: isDeleting }] =
    useDeletePermissionMutation();

  const handleView = useCallback(
    (id: string | number) => {
      router.push(AppRoutes.PERMISSION_DETAIL(String(id)));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string | number) => {
      router.push(`${AppRoutes.PERMISSION_DETAIL(String(id))}?edit=true`);
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
      await deletePermission(deleteDialog.data);
      deleteDialog.handleClose();
    }
  };

  const columns: GridColDef<IPermission>[] = useMemo(
    () => [
      {
        field: "description",
        headerName: t("common.description"),
        flex: 1,
      },
      {
        field: "subject",
        headerName: t("common.subject"),
      },
      {
        field: "action",
        headerName: t("common.action"),
      },
      {
        field: "createdAt",
        headerName: t("common.created_at"),
        width: 120,
        renderCell: (params: GridRenderCellParams<IPermission>) =>
          formatDate(params.row.createdAt),
      },
      {
        field: "actions",
        headerName: "",
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<IPermission>) => (
          <Stack direction="row" spacing={0.5}>
            {can(PERMISSIONS.PERMISSIONS.READ) && (
              <Tooltip title={t("common.view") || "View"}>
                <IconButton
                  size="small"
                  onClick={() => handleView(params.row.id)}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.PERMISSIONS.UPDATE) && (
              <Tooltip title={t("common.edit") || "Edit"}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(params.row.id)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(PERMISSIONS.PERMISSIONS.DELETE) && (
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
        name: "action",
        label: "Action",
        options: [
          { value: "create", label: "Create" },
          { value: "read", label: "Read" },
          { value: "update", label: "Update" },
          { value: "delete", label: "Delete" },
        ],
      },
      {
        name: "subject",
        label: "Subject",
        options: [
          { value: "User", label: "User" },
          { value: "Role", label: "Role" },
          { value: "Permission", label: "Permission" },
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
        title={t("permissions.delete_confirmation_title")}
        message={t("permissions.delete_confirmation_message")}
        onConfirm={handleDeleteConfirm}
        onClose={deleteDialog.handleClose}
        isConfirming={isDeleting}
      />
    </>
  );
}
