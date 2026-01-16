"use client";

import { StoreProvider } from "./StoreProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <StoreProvider>{children}</StoreProvider>;
}

export { StoreProvider };
