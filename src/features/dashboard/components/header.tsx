"use client";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end gap-2 border-b bg-background px-4">
      <LanguageSwitcher />
      <ThemeSwitcher />
      <UserMenu />
    </header>
  );
}
