"use client";

import { AppButton } from "@/components/ui/app-button";
import { useTranslation } from "@/hooks/use-translation";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log the error using our structured logger
    logger.error(error, "Global application error");
  }, [error]);

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
          <Typography variant="h1" fontWeight="bold" color="error">
            !
          </Typography>
          <Typography variant="h4" component="h2">
            {t("errors.server_error_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="sm">
            {t("errors.server_error_description")}
          </Typography>
          <AppButton onClick={() => reset()}>{t("errors.try_again")}</AppButton>
        </Stack>
      </Box>
    </Container>
  );
}
