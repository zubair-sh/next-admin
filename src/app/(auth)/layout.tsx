"use client";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Box } from "@mui/material";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Box sx={{ position: "fixed", top: 10, right: 15 }}>
        <LanguageSwitcher />
      </Box>
      <Box sx={{ position: "fixed", top: 10, right: 60 }}>
        <ThemeSwitcher />
      </Box>
      {children}
    </>
  );
}
