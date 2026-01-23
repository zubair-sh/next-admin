"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings as SettingsIcon,
  DarkMode,
  LightMode,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import { useSettings } from "@/providers/settings-provider";
import { useTranslation } from "@/hooks/use-translation";
import type { Language } from "@/providers/settings-provider";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/config/constants";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { mode, toggleMode, language, setLanguage } = useSettings();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
    setLanguageAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);
  const isLanguageOpen = Boolean(languageAnchor);

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: "New user registered", time: "5 min ago" },
    { id: 2, title: "System update available", time: "1 hour ago" },
    { id: 3, title: "New message received", time: "2 hours ago" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha("#ffffff", 0.8),
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {t("header.title")}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            onClick={toggleMode}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* Language Selector */}
          <IconButton
            onClick={handleLanguageMenuOpen}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <LanguageIcon />
          </IconButton>

          {/* Notifications */}
          {/* <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}

          {/* User Profile */}
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
              ml: 1,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
              }}
            >
              {user?.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              overflow: "visible",
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role?.name}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              router.push(AppRoutes.PROFILE);
            }}
          >
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("header.profile")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("header.settings")}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">{t("common.logout")}</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={isNotificationOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 320,
              maxWidth: 360,
              borderRadius: 2,
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t("header.notifications")}
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleMenuClose}>
              <Box>
                <Typography variant="body2">{notification.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ width: "100%", textAlign: "center", fontWeight: 600 }}
            >
              {t("header.view_all")}
            </Typography>
          </MenuItem>
        </Menu>

        {/* Language Menu */}
        <Menu
          anchorEl={languageAnchor}
          open={isLanguageOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: 2,
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
            },
          }}
        >
          <MenuItem
            onClick={() => handleLanguageChange("en")}
            selected={language === "en"}
          >
            <ListItemText>English</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleLanguageChange("ar")}
            selected={language === "ar"}
          >
            <ListItemText>العربية</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
