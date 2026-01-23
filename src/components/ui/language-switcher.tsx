"use client";

import { useState, MouseEvent } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Language } from "@mui/icons-material";
import { useSettings } from "@/providers/settings-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useSettings();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: "en" | "ar") => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Language />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={language === "en"}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange("ar")}
          selected={language === "ar"}
        >
          العربية
        </MenuItem>
      </Menu>
    </>
  );
}
