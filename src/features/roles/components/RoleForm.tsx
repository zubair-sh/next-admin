"use client";

import { AppButton, AppField } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, Grid2 as Grid, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type CreateRoleFormData,
  type UpdateRoleFormData,
  updateRoleSchema,
  createRoleSchema,
} from "@/features/roles/schemas";
import { IRole } from "@/features/roles/types";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetRolesQuery,
  useLazyGetRoleByIdQuery,
} from "@/features/roles/api";
import { toast } from "sonner";
import { AppRoutes } from "@/config/constants";
import { useTranslation } from "@/hooks";
import { PermissionSelector } from "./PermissionSelector";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState } from "react";

interface RoleFormProps {
  role?: IRole;
}

type RoleFormData = CreateRoleFormData | UpdateRoleFormData;

export function RoleForm({ role }: RoleFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [getRoleById, { isFetching: isFetchingRole }] =
    useLazyGetRoleByIdQuery();

  const { data: rolesData } = useGetRolesQuery({});
  const [selectedCopyRole, setSelectedCopyRole] = useState<IRole | null>(null);

  const isEditing = !!role;
  const isLoading = isCreating || isUpdating || isFetchingRole;

  const { handleSubmit, reset, control, setValue } = useForm<RoleFormData>({
    resolver: zodResolver(isEditing ? updateRoleSchema : createRoleSchema),
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
        permissionIds: role.permissions?.map((p) => p.id) || [],
      });
    }
  }, [role, reset]);

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      if (isEditing && role) {
        await updateRole({
          id: role.id,
          data,
        }).unwrap();
        toast.success(t("roles.update_success"));
      } else {
        await createRole(data as CreateRoleFormData).unwrap();
        toast.success(t("roles.create_success"));
      }
      router.push(AppRoutes.ROLES);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.data?.message || "");
    }
  };

  const handleCopyFromRole = async (_: unknown, value: IRole | null) => {
    setSelectedCopyRole(value);
    if (value) {
      try {
        const roleDetails = await getRoleById(value.id).unwrap();
        const permissionIds = roleDetails.permissions?.map((p) => p.id) || [];
        setValue("permissionIds", permissionIds, {
          shouldValidate: true,
          shouldDirty: true,
        });
        toast.success(t("roles.permissions_copied"));
      } catch (error) {
        console.error("Failed to fetch role details", error);
        toast.error(t("roles.copy_failed"));
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <AppField
                    control={control}
                    name="name"
                    label={t("common.name")}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <AppField
                    control={control}
                    name="description"
                    label={t("common.description")}
                    multiline
                    rows={4}
                  />
                </Grid>

                {!isEditing && (
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      options={rolesData?.items || []}
                      getOptionLabel={(option) => option.name}
                      value={selectedCopyRole}
                      onChange={handleCopyFromRole}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("roles.copy_from_role")}
                          placeholder={t("roles.select_role_to_copy")}
                          helperText={t("roles.copy_helper_text")}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      disabled={isLoading}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                {t("common.permissions")}
              </Typography>
              <Controller
                control={control}
                name="permissionIds"
                render={({ field }) => (
                  <PermissionSelector
                    selectedIds={field.value || []}
                    onChange={field.onChange}
                  />
                )}
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
              {role ? t("roles.update_button") : t("roles.create_button")}
            </AppButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
