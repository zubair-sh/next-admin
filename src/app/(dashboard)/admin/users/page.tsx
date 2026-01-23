"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { UserTable } from "@/features/users/components";
import { useExportUsersMutation, useGetUsersQuery } from "@/features/users/api";
import { useSearchQuery, useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import {
  Add as AddIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function UsersPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const router = useRouter();
  const query = useSearchQuery([
    "page",
    "pageSize",
    "sortBy",
    "sortOrder",
    "search",
    "status",
    "roleId",
  ]);

  const { data, isLoading } = useGetUsersQuery({ ...query });
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  if (!can(PERMISSIONS.USERS.READ_ALL)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleAddUser = () => {
    router.push(AppRoutes.USER_NEW);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const { search, status, roleId } = query;
      await exportUsers({
        format,
        search: search as string | undefined,
        status: status as string | undefined,
        roleId: roleId as string | undefined,
      }).unwrap();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      handleExportClose();
    }
  };

  return (
    <>
      <PageHeader
        title={t("users.list_title")}
        actions={
          <>
            <Button
              variant="outlined"
              onClick={handleExportClick}
              startIcon={
                isExporting ? <CircularProgress size={20} /> : <ExportIcon />
              }
              disabled={isExporting}
            >
              {t("common.export")}
            </Button>
            <Menu
              anchorEl={exportMenuAnchor}
              open={Boolean(exportMenuAnchor)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={() => handleExport("csv")}>
                <ListItemIcon>
                  <ExportIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("common.export_csv")}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleExport("xlsx")}>
                <ListItemIcon>
                  <ExportIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("common.export_excel")}</ListItemText>
              </MenuItem>
            </Menu>
          </>
        }
        action={
          can(PERMISSIONS.USERS.CREATE)
            ? {
                label: t("users.add_user"),
                onClick: handleAddUser,
                icon: <AddIcon />,
              }
            : undefined
        }
      />

      <UserTable data={data} isLoading={isLoading} />
    </>
  );
}
