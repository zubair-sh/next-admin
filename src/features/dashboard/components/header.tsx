"use client";

import { LanguageSwitcher, ThemeSwitcher } from "@/components/shared";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end gap-2 border-b bg-background px-4">
      <LanguageSwitcher />
      <ThemeSwitcher />
      <UserMenu />
    </header>
  );
}
