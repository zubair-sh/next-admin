"use client";

import { PageHeader } from "@/components/layout";
import { AppRoutes } from "@/config/constants";
import { UserForm } from "@/features/users/components";
import { useGetUserByIdQuery } from "@/features/users/api";
import { Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
  Chip,
} from "@mui/material";
import {
  useParams,
  useRouter,
  useSearchParams,
  redirect,
} from "next/navigation";
import { useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { useGetRolesQuery } from "@/features/roles/api";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function UserDetailPage() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = params.id as string;
  const isEditMode = searchParams.get("edit") === "true";

  const { data: user, isLoading } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: rolesData } = useGetRolesQuery({});

  if (!can(PERMISSIONS.USERS.READ)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  const handleEdit = () => {
    router.push(`${AppRoutes.USER_DETAIL(String(userId))}?edit=true`);
  };

  if (isLoading || !rolesData?.items) {
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
    if (!can(PERMISSIONS.USERS.UPDATE)) {
      return redirect(AppRoutes.NOT_FOUND);
    }

    return (
      <>
        <PageHeader title={t("users.edit_user")} backButton={true} />
        <UserForm user={user} roles={rolesData?.items || []} />
      </>
    );
  }

  const statusColors = {
    active: "success",
    inactive: "warning",
    deleted: "error",
  } as const;

  return (
    <>
      <PageHeader
        title={user?.fullName || ""}
        backButton={true}
        action={
          can(PERMISSIONS.USERS.UPDATE)
            ? {
                label: t("users.edit_user"),
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
                {t("common.email")}
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.full_name")}
              </Typography>
              <Typography variant="body1">{user?.fullName || "—"}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.first_name")}
              </Typography>
              <Typography variant="body1">{user?.firstName || "—"}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.last_name")}
              </Typography>
              <Typography variant="body1">{user?.lastName || "—"}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.role")}
              </Typography>
              <Typography variant="body1">{user?.role?.name || "—"}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {t("common.status")}
              </Typography>
              {user?.status && (
                <Chip
                  label={t(`users.status_${user.status}`)}
                  color={statusColors[user.status]}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
