"use client";

import React, { useState } from "react";
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useController,
} from "react-hook-form";
import { useTranslation } from "@/hooks/use-translation";

export type AppFieldProps<T extends FieldValues> = Omit<
  MuiTextFieldProps,
  "name" | "defaultValue"
> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export const AppField = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  ...props
}: AppFieldProps<T>) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "" as PathValue<T, Path<T>>,
  });

  const isPassword = type === "password";

  return (
    <Stack>
      {label && <label htmlFor={props.id ?? name}>{label}</label>}

      <MuiTextField
        {...props}
        {...field}
        id={props.id ?? name}
        fullWidth
        variant="outlined"
        type={isPassword ? (showPassword ? "text" : "password") : type}
        error={!!error}
        helperText={error ? t(`validation.${error.message}`) : props.helperText}
        InputProps={{
          ...props.InputProps,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : (
            props.InputProps?.endAdornment
          ),
        }}
      />
    </Stack>
  );
};
