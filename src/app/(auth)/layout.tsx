import { LanguageSwitcher } from "@/features/dashboard/components/language-switcher";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      {children}
    </div>
  );
}
