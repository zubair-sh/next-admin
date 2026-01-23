"use client";

import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "@/hooks/use-translation";

export function SignUpSuccessCard() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xs">
      <Stack sx={{ minHeight: "100vh" }} justifyContent="center">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack alignItems="center">
                <Typography variant="h4" component="h1">
                  {t("auth.sign_up_success_title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("auth.sign_up_success_subtitle")}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" align="center">
                {t("auth.sign_up_success_message")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
