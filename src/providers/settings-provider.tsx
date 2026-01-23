"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { setCookie } from "cookies-next";

export type ThemeMode = "light" | "dark";
export type Language = "en" | "ar";

interface SettingsContextType {
  mode: ThemeMode;
  language: Language;
  toggleMode: () => void;
  setLanguage: (lang: Language) => void;
  direction: "ltr" | "rtl";
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export type SettingsProviderProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
  initialLanguage?: Language;
};

export function SettingsProvider({
  children,
  initialMode = "light",
  initialLanguage = "en",
}: SettingsProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // We don't need 'mounted' state hack anymore because we hydrate with correct server data
  useEffect(() => {
    // Still good to sync if needed, but not critical for initial render
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    setCookie("theme-mode", newMode);
  };

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    setCookie("app-language", lang);
    // Update HTML dir attribute for immediate feedback if needed,
    // though MuiThemeProvider handling it is cleaner for styled components.
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  // Prevent hydration mismatch by returning null or a consistent state strictly if needed.
  // However, for theme providers, we often want to render something.
  // We'll trust the provider to handle appropriate initial rendering or accept a flash.
  // Ideally we read cookies in the Server Component and pass as props to the Provider.
  // But for this step, client-side only initialization is acceptable.

  return (
    <SettingsContext.Provider
      value={{
        mode,
        language,
        toggleMode,
        setLanguage: updateLanguage,
        direction,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
// Note: Hiding children until mounted prevents hydration mismatch but harms SEO/LCP.
// A better approach is passing initial values from server.
// Given constraints, I'll proceed with this but consider server-side cookie reading if easy.

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
