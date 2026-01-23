"use client";

import { useTranslation } from "@/hooks/use-translation";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AppButton } from "./app-button";

export interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  isConfirming?: boolean;
  confirmColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export function AppDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  children,
  cancelText,
  confirmText,
  isConfirming = false,
  confirmColor = "primary",
}: AppDialogProps) {
  const { t } = useTranslation();
  const effectiveCancelText = cancelText || t("common.cancel");
  const effectiveConfirmText = confirmText || t("common.confirm");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {message && <DialogContentText>{message}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions>
        <AppButton variant="outlined" onClick={onClose} disabled={isConfirming}>
          {effectiveCancelText}
        </AppButton>
        <AppButton
          onClick={onConfirm}
          color={confirmColor}
          isLoading={isConfirming}
        >
          {effectiveConfirmText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
