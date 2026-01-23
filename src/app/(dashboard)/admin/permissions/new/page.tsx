"use client";

import { PageHeader } from "@/components/layout";
import { PermissionForm } from "@/features/permissions/components";
import { useTranslation } from "@/hooks";
import { usePermission } from "@/features/auth/hooks";
import { AppRoutes } from "@/config/constants";
import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/config/constants/permissions";

export default function NewPermissionPage() {
  const { t } = useTranslation();
  const { can } = usePermission();

  if (!can(PERMISSIONS.PERMISSIONS.CREATE)) {
    return redirect(AppRoutes.NOT_FOUND);
  }

  return (
    <>
      <PageHeader title={t("permissions.new_permission")} backButton={true} />
      <PermissionForm />
    </>
  );
}
