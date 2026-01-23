"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton, AppField, AppLink } from "@/components/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/schemas";
import { useAuth } from "@/features/auth/hooks";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "@/hooks/use-translation";
import { AppRoutes } from "@/config/constants";

export function ForgotPasswordForm() {
  const { isLoading, forgotPassword, isSuccess } = useAuth();
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword(data);
  };

  return (
    <Container maxWidth="xs">
      <Stack sx={{ minHeight: "100vh" }} justifyContent="center">
        <Card>
          <CardContent>
            {isSuccess ? (
              <Stack spacing={2}>
                <Stack alignItems="center">
                  <Typography variant="h4" component="h1">
                    {t("auth.forgot_password_success_title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("auth.forgot_password_success_subtitle")}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {t("auth.forgot_password_success_message")}
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Stack alignItems="center">
                  <Typography variant="h4" component="h1">
                    {t("auth.forgot_password_title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("auth.forgot_password_subtitle")}
                  </Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2}>
                    <Stack spacing={1}>
                      <AppField
                        control={control}
                        name="email"
                        label={t("common.email")}
                        type="email"
                        disabled={isLoading}
                      />
                    </Stack>
                    <AppButton type="submit" isLoading={isLoading}>
                      {t("auth.send_reset_password_link")}
                    </AppButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {t("auth.back_to_login")}{" "}
                      <AppLink href={AppRoutes.LOGIN}>
                        {t("auth.sign_in")}
                      </AppLink>
                    </Typography>
                  </Stack>
                </form>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
