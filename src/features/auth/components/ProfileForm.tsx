"use client";

import { AppButton, AppField } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type UpdateProfileFormData,
  updateProfileSchema,
} from "@/features/auth/schemas";
import { useUpdateProfileMutation } from "@/features/auth/api";
import { toast } from "sonner";
import { useTranslation } from "@/hooks";
import { IUser } from "@/features/users/types";

interface ProfileFormProps {
  user: IUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t } = useTranslation();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { handleSubmit, reset, control } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success(
        t("common.update_success") || "Profile updated successfully",
      );
      // Keep form values but clear password
      reset({ ...data, password: "" });
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppField
                name="firstName"
                control={control}
                label={t("common.first_name")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppField
                name="lastName"
                control={control}
                label={t("common.last_name")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppField
                name="email"
                control={control}
                label={t("common.email")}
                type="email"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppField
                name="password"
                control={control}
                label={t("common.password")}
                type="password"
                helperText={
                  t("users.password_helper_text") ||
                  "Leave blank to keep current password"
                }
              />
            </Grid>
          </Grid>

          <Stack sx={{ mt: 4 }} direction="row" justifyContent="flex-end">
            <AppButton type="submit" isLoading={isLoading}>
              {t("common.save")}
            </AppButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
