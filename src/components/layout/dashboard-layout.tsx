"use client";

import { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "row" }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        variant={isMobile ? "temporary" : "permanent"}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: {
            xs: "100%",
            md: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)`,
          },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f5f7fa",
        }}
      >
        {/* Header */}
        <Header onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            mt: { xs: 7, sm: 8 }, // Account for fixed header
            p: { xs: 2, sm: 3, md: 4 },
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
