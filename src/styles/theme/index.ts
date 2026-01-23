"use client";

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { componentOverrides } from "./components";

const getThemeOptions = (
  mode: "light" | "dark",
  direction: "ltr" | "rtl",
): ThemeOptions => ({
  direction,
  palette: mode === "light" ? lightPalette : darkPalette,
  typography,
  shape: {
    borderRadius: 8,
  },
  components: componentOverrides,
});

export const getTheme = (
  mode: "light" | "dark",
  direction: "ltr" | "rtl" = "ltr",
) => createTheme(getThemeOptions(mode, direction));
