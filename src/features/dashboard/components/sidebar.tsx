"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Menu,
  ChevronLeft,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

const iconClasses = "h-5 w-5";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  const navItems = [
    {
      title: t("overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("team"),
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2 font-semibold">
            <span>{t("title")}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className={iconClasses} />
          ) : (
            <ChevronLeft className={iconClasses} />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              asChild
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Link href={item.href}>
                <item.icon
                  className={cn(iconClasses, !isCollapsed && "mr-2")}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
