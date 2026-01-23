"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { PermissionForm } from "@/features/permissions/components";
import { useGetPermissionByIdQuery } from "@/features/permissions/api";
import { Edit as EditIcon } from "@mui/icons-material";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import {
  useParams,
  useRouter,
  useSearchParams,
  redirect,
} from "next/navigation";
import { useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function PermissionDetailPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const permissionId = params.id as string;
  const isEditMode = searchParams.get("edit") === "true";

  const { data: permission, isLoading } = useGetPermissionByIdQuery(
    permissionId,
    { skip: !permissionId },
  );

  if (!can(PERMISSIONS.PERMISSIONS.READ)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleEdit = () => {
    router.push(
      `${AppRoutes.PERMISSION_DETAIL(String(permissionId))}?edit=true`,
    );
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={"Loading..."} />
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </>
    );
  }

  if (isEditMode) {
    if (!can(PERMISSIONS.PERMISSIONS.UPDATE)) {
      return redirect(AppRoutes.NOT_FOUND);
    }

    return (
      <>
        <PageHeader
          title={t("permissions.edit_permission")}
          backButton={true}
        />
        <PermissionForm permission={permission} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={permission?.description || ""}
        backButton={true}
        action={
          can(PERMISSIONS.PERMISSIONS.UPDATE)
            ? {
                label: t("permissions.edit_permission"),
                onClick: handleEdit,
                icon: <EditIcon />,
              }
            : undefined
        }
      />

      <Card>
        <CardContent>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 4 }}
          >
            <Typography variant="h6">
              {t("permissions.permission_details")}
            </Typography>
            <Typography variant="body1">{permission?.description}</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 4 }}
          >
            <Typography variant="h6">{t("common.subject")}</Typography>
            <Typography variant="body1">{permission?.subject}</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 4 }}
          >
            <Typography variant="h6">{t("common.action")}</Typography>
            <Typography variant="body1">{permission?.action}</Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
