import { Components, Theme } from "@mui/material/styles";

export const componentOverrides: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 600,
        padding: "8px 16px",
      },
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: "16px 24px",
      },
      title: {
        fontSize: "1.125rem",
        fontWeight: 600,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "24px",
        "&:last-child": {
          paddingBottom: "24px",
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small",
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 600,
        backgroundColor: "inherit",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:last-child td": {
          borderBottom: 0,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: "none",
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 4,
        "&.Mui-selected": {
          fontWeight: 600,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "1.5rem", // adjust as needed
        fontWeight: 600,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 12,
      },
    },
  },
};
