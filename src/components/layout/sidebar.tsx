"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { usePermission } from "@/features/auth/hooks/usePermission";
import { useSettings } from "@/providers/settings-provider";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

import { PERMISSIONS } from "@/config/constants/permissions";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  variant?: "permanent" | "temporary";
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const theme = useTheme();
  const { direction } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { can } = usePermission();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: t("sidebar.dashboard"),
      icon: <DashboardIcon />,
      path: "/dashboard",
      permission: PERMISSIONS.DASHBOARD.READ,
    },
    {
      id: "analytics",
      label: t("sidebar.analytics"),
      icon: <AnalyticsIcon />,
      permission: PERMISSIONS.ANALYTICS.READ,
      children: [
        {
          id: "overview",
          label: t("sidebar.overview"),
          icon: <AnalyticsIcon />,
          path: "/analytics/overview",
        },
        {
          id: "reports",
          label: t("sidebar.reports"),
          icon: <AnalyticsIcon />,
          path: "/analytics/reports",
        },
      ],
    },
    {
      id: "admin",
      label: t("sidebar.admin"),
      icon: <AdminIcon />,
      permission: PERMISSIONS.ROLES.READ,
      children: [
        {
          id: "users",
          label: t("sidebar.users"),
          icon: <PeopleIcon />,
          path: "/admin/users",
          permission: PERMISSIONS.USERS.READ_ALL,
        },
        {
          id: "roles",
          label: t("sidebar.roles"),
          icon: <SecurityIcon />,
          path: "/admin/roles",
          permission: PERMISSIONS.ROLES.READ_ALL,
        },
        {
          id: "permissions",
          label: t("sidebar.permissions"),
          icon: <SecurityIcon />,
          path: "/admin/permissions",
          permission: PERMISSIONS.PERMISSIONS.READ_ALL,
        },
      ],
    },
    {
      id: "settings",
      label: t("sidebar.settings"),
      icon: <SettingsIcon />,
      path: "/settings",
      permission: PERMISSIONS.SETTINGS.READ,
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else if (item.path) {
      router.push(item.path);
      if (isMobile) {
        onToggle();
      }
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const active = isActive(item.path);
    const expanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              pl: depth > 0 ? 4 : 2.5,
              backgroundColor: active
                ? alpha(theme.palette.primary.main, 0.12)
                : "transparent",
              borderInlineStart: active
                ? `3px solid ${theme.palette.primary.main}`
                : "3px solid transparent",
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  active ? 0.16 : 0.08,
                ),
              },
              transition: theme.transitions.create(
                ["background-color", "border-color"],
                {
                  duration: theme.transitions.duration.short,
                },
              ),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                marginInlineEnd: open ? 3 : "auto",
                justifyContent: "center",
                color: active ? theme.palette.primary.main : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                opacity: open ? 1 : 0,
                color: active ? theme.palette.primary.main : "inherit",
                fontWeight: active ? 600 : 400,
                flex: 1,
                textAlign: "start",
              }}
            />
            {hasChildren && open && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && open && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item
                .children!.filter(
                  (child) => !child.permission || can(child.permission),
                )
                .map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha("#ffffff", 0.8),
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
          minHeight: 64,
        }}
      >
        {!isMobile && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {direction === "rtl" ? (
              open ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )
            ) : open ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", py: 2 }}>
        <List>
          {menuItems
            .filter((item) => !item.permission || can(item.permission))
            .map((item) => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              display: "block",
              textAlign: "center",
            }}
          >
            © 2026 Admin Panel
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        key={direction}
        variant="temporary"
        open={open}
        onClose={onToggle}
        anchor={direction === "rtl" ? "right" : "left"}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      key={direction}
      variant="permanent"
      open={open}
      anchor={direction === "rtl" ? "right" : "left"}
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          border: "none",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
