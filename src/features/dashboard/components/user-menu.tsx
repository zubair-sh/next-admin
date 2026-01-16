"use client";

import { useDictionary } from "@/hooks";
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useUser } from "@/features/auth/hooks/use-user";
import { signOut } from "@/features/auth/actions";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function UserMenu() {
  const { user } = useUser();
  const dictionary = useDictionary();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8" src="" alt={user.email || ""} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.email?.split("@")[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.PROFILE}>
              <User className="mr-2 h-4 w-4" />
              <span>{dictionary.Header.profile}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.SETTINGS}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{dictionary.Dashboard.settings}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{dictionary.Header.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
