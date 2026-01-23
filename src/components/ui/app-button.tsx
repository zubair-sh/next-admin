"use client";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";
import { forwardRef } from "react";

export interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
}

export const AppButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, disabled, startIcon, ...props }, ref) => {
    return (
      <MuiButton
        ref={ref}
        disabled={disabled || isLoading}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon
        }
        variant="contained"
        {...props}
      >
        {children}
      </MuiButton>
    );
  },
);

AppButton.displayName = "AppButton";
