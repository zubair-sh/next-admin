import type { Metadata } from "next";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Admin",
  description: "Modern admin dashboard built with Next.js",
};

import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("app-language")?.value || "en") as "en" | "ar";
  const mode = (cookieStore.get("theme-mode")?.value || "light") as
    | "light"
    | "dark";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body suppressHydrationWarning>
        <Providers initialLanguage={lang} initialMode={mode}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
