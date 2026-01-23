"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton, AppField } from "@/components/ui";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas";
import { useAuth } from "@/features/auth/hooks";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "@/hooks/use-translation";

export function ResetPasswordForm({ code }: { code?: string }) {
  const { isLoading, resetPassword } = useAuth();
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    console.log({
      password: data.password,
      code,
    });

    await resetPassword({
      password: data.password,
      code,
    });
  };

  return (
    <Container maxWidth="xs">
      <Stack sx={{ minHeight: "100vh" }} justifyContent="center">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center">
                <Typography variant="h4" component="h1">
                  {t("auth.reset_password_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("auth.reset_password_subtitle")}
                </Typography>
              </Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    <AppField
                      control={control}
                      name="password"
                      label={t("common.password")}
                      type="password"
                      disabled={isLoading}
                    />
                    <AppField
                      control={control}
                      name="confirmPassword"
                      label={t("common.confirm_password")}
                      type="password"
                      disabled={isLoading}
                    />
                  </Stack>
                  <AppButton type="submit" isLoading={isLoading}>
                    {t("auth.reset_password")}
                  </AppButton>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
