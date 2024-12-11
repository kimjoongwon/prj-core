import { AppBuilder } from '@shared/frontend';
import { createContext, useContext } from 'react';

const AppBuilderContext = createContext<AppBuilder>({} as AppBuilder);

export const AppBuilderProvider = ({
  children,
  appBuilder,
}: {
  children: React.ReactNode;
  appBuilder: AppBuilder;
}) => {
  return (
    <AppBuilderContext.Provider value={appBuilder}>
      {children}
    </AppBuilderContext.Provider>
  );
};

export const useAppBuilder = () => {
  return useContext(AppBuilderContext);
};
