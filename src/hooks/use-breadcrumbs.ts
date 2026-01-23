"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "./use-translation";
import { AppRoutes } from "@/config/constants";
import { BreadcrumbItem } from "@/components/layout/page-header";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "common.dashboard",
  users: "sidebar.users",
  roles: "sidebar.roles",
  permissions: "sidebar.permissions",
  admin: "admin",
};

// Check if a string is a UUID
const isUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export function useBreadcrumbs(customLabel?: string): BreadcrumbItem[] {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isEditMode = searchParams.get("edit") === "true";

  const getLabel = (
    segment: string,
    isLast: boolean,
    nextSegment?: string,
  ): string => {
    // Handle special cases
    if (segment === "new") {
      return t("common.new");
    }

    // Handle UUID segments
    if (isUUID(segment)) {
      // If it's the last segment and in edit mode, show "Edit"
      if (isLast && isEditMode) {
        return t("common.edit");
      }
      // Otherwise show "View"
      return t("common.view");
    }

    // Handle route labels
    const key = ROUTE_LABELS[segment];
    if (key) {
      if (key === "admin") {
        return ""; // Skip admin in breadcrumbs
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any) || segment;
    }

    // Capitalize first letter as fallback
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("common.dashboard"), href: AppRoutes.DASHBOARD },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const nextSegment = segments[index + 1];

    const label =
      isLast && customLabel
        ? customLabel
        : getLabel(segment, isLast, nextSegment);

    // Skip admin and empty labels
    if (label === "" || label === "admin") {
      return;
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
