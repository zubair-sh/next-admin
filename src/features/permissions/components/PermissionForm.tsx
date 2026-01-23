"use client";

import { AppButton, AppField } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type CreatePermissionFormData,
  type UpdatePermissionFormData,
  updatePermissionSchema,
  createPermissionSchema,
} from "@/features/permissions/schemas";
import { IPermission } from "@/features/permissions/types";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "@/features/permissions/api";
import { toast } from "sonner";
import { AppRoutes } from "@/config/constants";
import { useTranslation } from "@/hooks";

interface PermissionFormProps {
  permission?: IPermission;
}

type PermissionFormData = CreatePermissionFormData | UpdatePermissionFormData;

export function PermissionForm({ permission }: PermissionFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [createPermission, { isLoading: isCreating }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] =
    useUpdatePermissionMutation();
  const isEditing = !!permission;
  const isLoading = isCreating || isUpdating;

  const { control, handleSubmit, reset } = useForm<PermissionFormData>({
    resolver: zodResolver(
      isEditing ? updatePermissionSchema : createPermissionSchema,
    ),
  });

  useEffect(() => {
    if (permission) {
      reset({
        action: permission.action,
        subject: permission.subject,
        description: permission.description,
      });
    }
  }, [permission, reset]);

  const handleFormSubmit = async (data: PermissionFormData) => {
    try {
      if (isEditing && permission) {
        await updatePermission({
          id: permission.id,
          data,
        }).unwrap();
        toast.success(t("permissions.update_success"));
      } else {
        await createPermission(data).unwrap();
        toast.success(t("permissions.create_success"));
      }
      router.push(AppRoutes.PERMISSIONS);
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
                control={control}
                name="description"
                label={t("common.description")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                control={control}
                name="action"
                label={t("common.action")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AppField
                control={control}
                name="subject"
                label={t("common.subject")}
              />
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
              {permission
                ? t("permissions.update_button")
                : t("permissions.create_button")}
            </AppButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
