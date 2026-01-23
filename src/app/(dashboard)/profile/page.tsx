"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "@/hooks";
import { ProfileForm } from "@/features/auth/components";
import { useGetProfileQuery } from "@/features/auth/api";
import { Card, CardContent, Skeleton } from "@mui/material";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return (
      <>
        <PageHeader title={"Loading..."} />
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </>
    );
  }

  if (!user) {
    return null; // Or show error
  }

  return (
    <>
      <PageHeader title={t("header.profile") || "Profile"} />
      <ProfileForm user={user} />
    </>
  );
}
