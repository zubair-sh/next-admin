import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetPermissionsQuery } from "@/features/permissions/api";
import { useTranslation } from "@/hooks";
import { useMemo, useState } from "react";
import { IPermission } from "@/features/permissions/types";

interface PermissionSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function PermissionSelector({
  selectedIds,
  onChange,
}: PermissionSelectorProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetPermissionsQuery({
    pageSize: 1000, // Fetch all permissions
    sortOrder: "asc",
    sortBy: "subject",
  });

  const permissions = data?.items || [];

  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return permissions;
    const lowerTerm = searchTerm.toLowerCase();
    return permissions.filter(
      (p) =>
        p.action.toLowerCase().includes(lowerTerm) ||
        p.subject.toLowerCase().includes(lowerTerm) ||
        p.description?.toLowerCase().includes(lowerTerm),
    );
  }, [permissions, searchTerm]);

  // Group permissions by subject
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce(
      (acc, permission) => {
        const subject = permission.subject;
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(permission);
        return acc;
      },
      {} as Record<string, IPermission[]>,
    );
  }, [filteredPermissions]);

  const handleToggle = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    onChange(newSelectedIds);
  };

  const handleGroupToggle = (subject: string) => {
    const groupIds = groupedPermissions[subject].map((p) => p.id);
    const allSelected = groupIds.every((id) => selectedIds.includes(id));

    let newSelectedIds = [...selectedIds];
    if (allSelected) {
      // Deselect all
      newSelectedIds = newSelectedIds.filter((id) => !groupIds.includes(id));
    } else {
      // Select all (add missing)
      const missing = groupIds.filter((id) => !selectedIds.includes(id));
      newSelectedIds = [...newSelectedIds, ...missing];
    }
    onChange(newSelectedIds);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder={
          t("permissions.search_placeholder") || "Search permissions..."
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box height={400} overflow="auto">
        {Object.entries(groupedPermissions).map(([subject, groupPerms]) => {
          const groupIds = groupPerms.map((p) => p.id);
          const selectedCount = groupIds.filter((id) =>
            selectedIds.includes(id),
          ).length;
          const isAllSelected = selectedCount === groupIds.length;
          const isIndeterminate =
            selectedCount > 0 && selectedCount < groupIds.length;

          return (
            <Accordion key={subject} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={() => handleGroupToggle(subject)}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {subject}
                      </Typography>
                      <Chip
                        label={`${selectedCount}/${groupIds.length}`}
                        size="small"
                        color={selectedCount > 0 ? "primary" : "default"}
                        variant={selectedCount > 0 ? "filled" : "outlined"}
                      />
                    </Box>
                  }
                />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  {groupPerms.map((permission) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={permission.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedIds.includes(permission.id)}
                            onChange={() => handleToggle(permission.id)}
                            name={permission.action}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {permission.action}
                            </Typography>
                            {permission.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {permission.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {Object.keys(groupedPermissions).length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={4}>
            {t("common.no_results") || "No permissions found"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
