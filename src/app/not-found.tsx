"use client";

import { AppButton } from "@/components/ui/app-button";
import { AppRoutes } from "@/config/constants";
import { useTranslation } from "@/hooks/use-translation";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h1" fontWeight="bold" color="primary">
            404
          </Typography>
          <Typography variant="h4" component="h2">
            {t("errors.not_found_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="sm">
            {t("errors.not_found_description")}
          </Typography>
          <AppButton onClick={() => router.push(AppRoutes.DASHBOARD)}>
            {t("errors.back_home")}
          </AppButton>
        </Stack>
      </Box>
    </Container>
  );
}
