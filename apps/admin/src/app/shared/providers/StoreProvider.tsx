import React from 'react';

export const StoreContext = React.createContext<any>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <StoreContext.Provider value={{}}>{children}</StoreContext.Provider>;
};
