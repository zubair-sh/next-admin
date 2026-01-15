"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push(ROUTES.LOGIN);
  };

  return <Button onClick={logout}>Logout</Button>;
}
