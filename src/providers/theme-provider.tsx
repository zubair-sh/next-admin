"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ReactNode } from "react";
import { getTheme } from "@/styles/theme";

import { useSettings } from "./settings-provider";

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  const { mode, direction } = useSettings();

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={getTheme(mode, direction)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
