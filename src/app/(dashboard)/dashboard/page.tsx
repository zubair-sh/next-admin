"use client";

import { useAuth } from "@/features/auth/hooks";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useTranslation } from "@/hooks/use-translation";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  const stats = [
    {
      id: 1,
      title: t("dashboard.card_title") + " 1",
      value: "1,234",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      change: "+12.5%",
    },
    {
      id: 2,
      title: t("dashboard.card_title") + " 2",
      value: "5,678",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      change: "+8.2%",
    },
    {
      id: 3,
      title: t("dashboard.card_title") + " 3",
      value: "9,012",
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      change: "+15.3%",
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("dashboard.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("dashboard.welcome_message")} {user?.email}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.id}>
            <Card
              sx={{
                height: "100%",
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : "white",
                border: `1px solid ${alpha(stat.color, 0.1)}`,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px ${alpha(stat.color, 0.2)}`,
                  borderColor: alpha(stat.color, 0.3),
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.8)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                    }}
                  >
                    <Typography variant="caption" fontWeight={600}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    color: theme.palette.text.primary,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Content Section */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.6)
                : "white",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.card_content", { number: 1 })}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
