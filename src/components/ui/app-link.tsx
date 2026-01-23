"use client";

import Link from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import { forwardRef } from "react";

export interface LinkProps extends MuiLinkProps {
  href: string;
}

export const AppLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <MuiLink
        ref={ref}
        href={href}
        component={Link}
        underline="none"
        prefetch={false}
        {...props}
      >
        {children}
      </MuiLink>
    );
  },
);

AppLink.displayName = "AppLink";
