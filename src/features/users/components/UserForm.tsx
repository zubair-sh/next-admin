"use client";

import { AppButton, AppField } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type CreateUserFormData,
  type UpdateUserFormData,
  updateUserSchema,
  createUserSchema,
} from "@/features/users/schemas";
import { IUser } from "@/features/users/types";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/features/users/api";
import { toast } from "sonner";
import { AppRoutes } from "@/config/constants";
import { useTranslation } from "@/hooks";
import { IRole } from "@/features/roles/types";

interface UserFormProps {
  user?: IUser;
  roles: IRole[];
}

type UserFormData = CreateUserFormData | UpdateUserFormData;

export function UserForm({ user, roles }: UserFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const isEditing = !!user;
  const isLoading = isCreating || isUpdating;

  const { handleSubmit, reset, control } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      status: "active",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        roleId: user.roleId,
        status: user.status,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && user) {
        await updateUser({
          id: user.id,
          data: data as UpdateUserFormData,
        }).unwrap();
        toast.success(t("users.update_success"));
      } else {
        await createUser(data as CreateUserFormData).unwrap();
        toast.success(t("users.create_success"));
      }
      router.push(AppRoutes.USERS);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.data?.message || "");
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                name="email"
                control={control}
                label={`${t("common.email")}*`}
                type="email"
              />
            </Grid>

            {!isEditing && (
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <AppField
                  name="password"
                  control={control}
                  label={`${t("common.password")}*`}
                  type="password"
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                name="firstName"
                control={control}
                label={`${t("common.first_name")}*`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                name="lastName"
                control={control}
                label={t("common.last_name")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                name="roleId"
                control={control}
                label={`${t("common.role")}*`}
                select
              >
                <MenuItem value="">{t("common.select")}</MenuItem>
                {roles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </AppField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                name="status"
                control={control}
                label={`${t("common.status")}*`}
                select
              >
                <MenuItem value="active">{t("common.active")}</MenuItem>
                <MenuItem value="inactive">{t("common.inactive")}</MenuItem>
                <MenuItem value="deleted">{t("common.deleted")}</MenuItem>
              </AppField>
            </Grid>
          </Grid>

          <Stack
            direction="row"
            gap={2}
            sx={{ mt: 4 }}
            justifyContent="flex-end"
          >
            <AppButton
              variant="outlined"
              onClick={() => reset()}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </AppButton>
            <AppButton type="submit" isLoading={isLoading}>
              {user ? t("users.update_button") : t("users.create_button")}
            </AppButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
