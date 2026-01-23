"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton, AppField, AppLink } from "@/components/ui";
import { signUpSchema, type SignUpFormData } from "@/features/auth/schemas";
import { useAuth } from "@/features/auth/hooks";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "@/hooks/use-translation";
import { AppRoutes } from "@/config/constants";

export function SignUpForm() {
  const { isLoading, signUp } = useAuth();
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUp({ ...data, role: "User" });
  };

  return (
    <Container maxWidth="xs">
      <Stack sx={{ minHeight: "100vh" }} justifyContent="center">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center">
                <Typography variant="h4" component="h1">
                  {t("auth.sign_up_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("auth.sign_up_subtitle")}
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
                    <AppField
                      control={control}
                      name="password"
                      label={t("common.password")}
                      type="password"
                      disabled={isLoading}
                    />
                  </Stack>
                  <AppButton type="submit" isLoading={isLoading}>
                    {t("auth.sign_up")}
                  </AppButton>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {t("auth.already_have_account")}{" "}
                    <AppLink href={AppRoutes.LOGIN}>
                      {t("auth.sign_in")}
                    </AppLink>
                  </Typography>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
