"use client";

import { PageHeader } from "@/components/layout";
import { UserForm } from "@/features/users/components";
import { useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { AppRoutes } from "@/config/constants";
import { redirect } from "next/navigation";
import { useGetRolesQuery } from "@/features/roles/api";
import { Card, CardContent, Skeleton } from "@mui/material";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function NewUserPage() {
  const { t } = useTranslation();
  const { can } = usePermission();

  const { data: rolesData } = useGetRolesQuery({});

  if (!can(PERMISSIONS.USERS.CREATE)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  if (!rolesData?.items) {
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

  return (
    <>
      <PageHeader title={t("users.new_user")} backButton={true} />
      <UserForm roles={rolesData?.items || []} />
    </>
  );
}
