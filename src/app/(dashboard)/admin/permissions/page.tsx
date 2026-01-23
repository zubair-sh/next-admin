"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { PermissionTable } from "@/features/permissions/components";
import {
  useExportPermissionsMutation,
  useGetPermissionsQuery,
} from "@/features/permissions/api";
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

export default function PermissionsPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const router = useRouter();
  const query = useSearchQuery([
    "page",
    "pageSize",
    "sortBy",
    "sortOrder",
    "search",
    "subject",
    "action",
  ]);

  const { data, isLoading } = useGetPermissionsQuery({ ...query });
  const [exportPermissions, { isLoading: isExporting }] =
    useExportPermissionsMutation();
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  if (!can(PERMISSIONS.PERMISSIONS.READ_ALL)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleAddPermission = () => {
    router.push(AppRoutes.PERMISSION_NEW);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const { search, subject, action } = query;
      await exportPermissions({
        format,
        search: search as string | undefined,
        subject: subject as string | undefined,
        action: action as string | undefined,
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
        title={t("permissions.list_title")}
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
          can(PERMISSIONS.PERMISSIONS.CREATE)
            ? {
                label: t("permissions.add_permission"),
                onClick: handleAddPermission,
                icon: <AddIcon />,
              }
            : undefined
        }
      />

      <PermissionTable data={data} isLoading={isLoading} />
    </>
  );
}
