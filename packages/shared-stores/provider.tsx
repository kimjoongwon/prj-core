'use client';

import React from 'react';
import { createContext } from 'react';
import { Store } from './store';

const StoreContext = createContext<Store | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
  value: Store;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const { value, children } = props;

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
