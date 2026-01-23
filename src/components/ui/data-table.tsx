"use client";

import {
  Close as CloseIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds

export interface FilterConfig {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<
  R extends GridValidRowModel = GridValidRowModel,
> extends Omit<
  DataGridProps<R>,
  "onPaginationModelChange" | "onSortModelChange" | "sortModel"
> {
  /**
   * Minimum width before horizontal scroll kicks in.
   * If not provided, the table will use auto-sizing based on columns.
   */
  minWidth?: number;
  /**
   * Default page size when not specified in URL.
   * @default 10
   */
  defaultPageSize?: number;
  /**
   * Enable search functionality
   */
  enableSearch?: boolean;
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Filter configurations
   */
  filters?: FilterConfig[];
  /**
   * Filter panel title
   */
  filterTitle?: string;
  /**
   * "All" option label for filters
   */
  allFilterLabel?: string;
}

export function DataTable<R extends GridValidRowModel = GridValidRowModel>({
  minWidth,
  sx,
  enableSearch = false,
  searchPlaceholder = "Search...",
  filters = [],
  filterTitle = "Filters",
  allFilterLabel = "All",
  ...props
}: DataTableProps<R>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  // Read sort parameters from URL
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || null;

  // Build sort model for DataGrid
  const sortModel: GridSortModel = useMemo(
    () => (sortBy && sortOrder ? [{ field: sortBy, sort: sortOrder }] : []),
    [sortBy, sortOrder],
  );

  // Count active filters
  const activeFiltersCount = filters.filter((f) =>
    searchParams.get(f.name),
  ).length;

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const filterOpen = Boolean(filterAnchorEl);

  const handlePaginationChange = (model: GridPaginationModel) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(model.page + 1));
    params.set("pageSize", String(model.pageSize));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (model: GridSortModel) => {
    const params = new URLSearchParams(searchParams.toString());
    const sortItem = model[0];
    if (sortItem?.sort) {
      params.set("sortBy", sortItem.field);
      params.set("sortOrder", sortItem.sort);
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }
    // Reset to first page when sorting changes
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      // Reset to first page when searching
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const debouncedUpdateSearchParam = useMemo(
    () => debounce(updateSearchParam, SEARCH_DEBOUNCE_DELAY),
    [updateSearchParam],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    debouncedUpdateSearchParam(value);
  };

  const handleFilterChange =
    (filterName: string) => (event: SelectChangeEvent) => {
      const value = event.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(filterName, value);
      } else {
        params.delete(filterName);
      }
      // Reset to first page when filtering
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    };

  const handleRemoveFilter = (filterName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterName);
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    filters.forEach((filter) => params.delete(filter.name));
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const activeFilters = filters
    .map((filter) => {
      const value = searchParams.get(filter.name);
      if (!value) return null;
      const option = filter.options.find((opt) => opt.value === value);
      return option
        ? { name: filter.name, label: filter.label, valueLabel: option.label }
        : null;
    })
    .filter(Boolean) as { name: string; label: string; valueLabel: string }[];

  return (
    <Stack spacing={2}>
      {(enableSearch || filters.length > 0) && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {enableSearch && (
            <TextField
              placeholder={searchPlaceholder}
              defaultValue={searchParams.get("search") || ""}
              onChange={handleSearchChange}
              size="small"
              fullWidth
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {filters.length > 0 && (
            <>
              <Badge badgeContent={activeFiltersCount} color="primary">
                <IconButton
                  onClick={handleFilterClick}
                  size="small"
                  sx={{ border: 1, borderColor: "divider" }}
                >
                  <FilterIcon />
                </IconButton>
              </Badge>

              <Popover
                open={filterOpen}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box sx={{ p: 3, minWidth: 300 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {filterTitle}
                  </Typography>

                  <Stack spacing={2}>
                    {filters.map((filter) => (
                      <FormControl key={filter.name} size="small" fullWidth>
                        <InputLabel>{filter.label}</InputLabel>
                        <Select
                          value={searchParams.get(filter.name) || ""}
                          onChange={handleFilterChange(filter.name)}
                          label={filter.label}
                        >
                          <MenuItem value="">
                            <em>{allFilterLabel}</em>
                          </MenuItem>
                          {filter.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ))}
                  </Stack>
                </Box>
              </Popover>
            </>
          )}
        </Box>
      )}

      {activeFilters.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {activeFilters.map((filter) => (
            <Chip
              key={filter.name}
              label={`${filter.label}: ${filter.valueLabel}`}
              onDelete={() => handleRemoveFilter(filter.name)}
              size="small"
              deleteIcon={<CloseIcon />}
            />
          ))}
          {activeFilters.length > 1 && (
            <Chip
              label="Clear all"
              onClick={handleClearAllFilters}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid<R>
          disableRowSelectionOnClick
          autoHeight
          sortModel={sortModel}
          onPaginationModelChange={handlePaginationChange}
          onSortModelChange={handleSortChange}
          sortingMode="server"
          sx={{
            border: "none",
            ...(minWidth && { minWidth }),
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            ...sx,
          }}
          {...props}
        />
      </Box>
    </Stack>
  );
}
