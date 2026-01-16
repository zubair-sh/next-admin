'use client';

import { AppStore, makeStore } from '@/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // This pattern is intentional - we need to access the ref during render
  // to provide the store to redux Provider. This is the recommended pattern
  // from Redux Toolkit docs for Next.js App Router.
  // See: https://redux.js.org/usage/nextjs
  /* eslint-disable react-hooks/refs */
  const storeRef = useRef<AppStore | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const persistorRef = useRef<any>(null);

  if (storeRef.current === null) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
  /* eslint-enable react-hooks/refs */
}
