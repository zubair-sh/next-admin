"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
