import { IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useSettings } from "@/providers/settings-provider";

export function ThemeSwitcher() {
  const { mode, toggleMode } = useSettings();

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
