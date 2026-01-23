"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { RoleForm } from "@/features/roles/components";
import { useGetRoleByIdQuery } from "@/features/roles/api";
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

export default function RoleDetailPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleId = params.id as string;
  const isEditMode = searchParams.get("edit") === "true";

  const { data: role, isLoading } = useGetRoleByIdQuery(roleId, {
    skip: !roleId,
  });

  if (!can(PERMISSIONS.ROLES.READ)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleEdit = () => {
    router.push(`${AppRoutes.ROLE_DETAIL(String(roleId))}?edit=true`);
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
    if (!can(PERMISSIONS.ROLES.UPDATE)) {
      return redirect(AppRoutes.NOT_FOUND);
    }

    return (
      <>
        <PageHeader title={t("roles.edit_role")} backButton={true} />
        <RoleForm role={role} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={role?.name || ""}
        backButton={true}
        action={
          can(PERMISSIONS.ROLES.UPDATE)
            ? {
                label: t("roles.edit_role"),
                onClick: handleEdit,
                icon: <EditIcon />,
              }
            : undefined
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.name")}
              </Typography>
              <Typography variant="body1">{role?.name}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.description")}
              </Typography>
              <Typography variant="body1">
                {role?.description || "—"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.permissions")}
              </Typography>
              {role?.permissions && role.permissions.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {role.permissions.map((permission) => (
                    <Box
                      key={permission.id}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: "0.875rem",
                      }}
                    >
                      {permission.description}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No permissions assigned
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
