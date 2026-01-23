"use client";

import { useBreadcrumbs } from "@/hooks";
import {
  ChevronLeft,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    variant?: "text" | "outlined" | "contained";
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  backButton?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs: customBreadcrumbs,
  action,
  actions,
  children,
  backButton,
}: PageHeaderProps) {
  const autoBreadcrumbs = useBreadcrumbs(title);
  const breadcrumbs = customBreadcrumbs || autoBreadcrumbs;
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return item.href && !isLast ? (
              <Link
                key={index}
                component={NextLink}
                href={item.href}
                prefetch={false}
                color="inherit"
                underline="hover"
                sx={{ fontSize: "0.875rem" }}
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                key={index}
                color="text.primary"
                sx={{ fontSize: "0.875rem" }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Stack direction="row" alignItems="center">
            {backButton && (
              <ChevronLeft
                fontSize="large"
                onClick={() => window.history.back()}
              />
            )}
            <Typography variant="h4" component="h1" fontWeight={700}>
              {title}
            </Typography>
          </Stack>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {(action || actions) && (
          <Stack direction="row" gap={1}>
            {actions}
            {action && (
              <Button
                variant={action.variant || "contained"}
                color={action.color || "primary"}
                onClick={action.onClick}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            )}
          </Stack>
        )}
        {children}
      </Stack>
    </Box>
  );
}
