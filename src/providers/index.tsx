"use client";

import { MuiThemeProvider } from "./theme-provider";
import { ReduxProvider } from "./redux-provider";
import { SettingsProvider } from "./settings-provider";
import { Toaster } from "sonner";

import { ThemeMode, Language } from "./settings-provider";

interface ProvidersProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialLanguage?: Language;
}

export function Providers({
  children,
  initialMode,
  initialLanguage,
}: ProvidersProps) {
  return (
    <ReduxProvider>
      <SettingsProvider
        initialMode={initialMode}
        initialLanguage={initialLanguage}
      >
        <MuiThemeProvider>
          <Toaster richColors />
          {children}
        </MuiThemeProvider>
      </SettingsProvider>
    </ReduxProvider>
  );
}
