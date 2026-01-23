import { PaginationOptions, PaginationParams } from "@/types";

// Utility functions
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export * from "./pick";
export * from "./match";
export * from "./download";
export * from "./date";

export function normalizePagination(
  options: PaginationOptions,
  defaults: Partial<PaginationParams> = {},
): { page: number; pageSize: number; sortOrder: string; sortBy: string } {
  return {
    page:
      Number(options.page) > 0 ? Number(options.page) : (defaults.page ?? 1),

    pageSize:
      Number(options.pageSize) > 0
        ? Number(options.pageSize)
        : (defaults.pageSize ?? 10),

    sortOrder:
      options.sortOrder === "asc" || options.sortOrder === "desc"
        ? options.sortOrder
        : (defaults.sortOrder ?? "desc"),

    sortBy:
      typeof options.sortBy === "string" && options.sortBy.trim() !== ""
        ? options.sortBy
        : (defaults.sortBy ?? "createdAt"),
  };
}
