"use client";

import { StoreProvider } from "./StoreProvider";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
// import { AuthInitializer } from "@/components/auth/auth-initializer";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <StoreProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <AuthInitializer /> */}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </StoreProvider>
  );
}

export { StoreProvider };
