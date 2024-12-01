import React from 'react';
import { createContext } from 'react';
import { Illit } from './Illit';

const StoreContext = createContext<Illit | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
  value: Illit;
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
