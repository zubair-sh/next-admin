"use client";

import { StoreProvider } from "./StoreProvider";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
}

export function Providers({ children, messages }: ProvidersProps) {
  return (
    <StoreProvider>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </StoreProvider>
  );
}

export { StoreProvider };
