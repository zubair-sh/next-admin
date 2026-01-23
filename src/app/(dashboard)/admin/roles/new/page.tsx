"use client";

import { PageHeader } from "@/components/layout";
import { RoleForm } from "@/features/roles/components";
import { useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { AppRoutes } from "@/config/constants";
import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function NewRolePage() {
  const { t } = useTranslation();
  const { can } = usePermission();

  if (!can(PERMISSIONS.ROLES.CREATE)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  return (
    <>
      <PageHeader title={t("roles.new_role")} backButton={true} />
      <RoleForm />
    </>
  );
}
