"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { usePermission } from "@/features/auth/hooks";
import { RoleTable } from "@/features/roles/components";
import { useExportRolesMutation, useGetRolesQuery } from "@/features/roles/api";
import { useSearchQuery, useTranslation } from "@/hooks";
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

export default function RolesPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const router = useRouter();
  const query = useSearchQuery([
    "page",
    "pageSize",
    "sortBy",
    "sortOrder",
    "search",
  ]);

  const { data, isLoading } = useGetRolesQuery({ ...query });
  const [exportRoles, { isLoading: isExporting }] = useExportRolesMutation();
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  if (!can(PERMISSIONS.ROLES.READ_ALL)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleAddRole = () => {
    router.push(AppRoutes.ROLE_NEW);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const { search } = query;
      await exportRoles({
        format,
        search: search as string | undefined,
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
        title={t("roles.list_title")}
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
          can(PERMISSIONS.ROLES.CREATE)
            ? {
                label: t("roles.add_role"),
                onClick: handleAddRole,
                icon: <AddIcon />,
              }
            : undefined
        }
      />

      <RoleTable data={data} isLoading={isLoading} />
    </>
  );
}
