"use client";

import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { AppRoutes } from "@/config/constants";

export function EmailVerifySuccessCard() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xs">
      <Stack sx={{ minHeight: "100vh" }} justifyContent="center">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center">
                <Typography variant="h4" component="h1">
                  {t("auth.email_verify_success_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("auth.email_verify_success_subtitle")}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                href={AppRoutes.LOGIN}
                component={Link}
              >
                {t("common.login")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
