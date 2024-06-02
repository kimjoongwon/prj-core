import React, { useContext, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { MyUniv } from '../../domains/myUniv';
import { isEmpty } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { usePrefechInitialData } from '../../hooks';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = React.createContext<MyUniv>({} as MyUniv);

export const useApp = () => {
  return useContext(AppContext);
};

export let myUniv: MyUniv = {} as MyUniv;

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const nextRouter = useRouter();

  usePrefechInitialData();

  useEffect(() => {
    myUniv = new MyUniv(nextRouter);
    myUniv.auth.refreshing();
  }, [nextRouter]);

  if (!myUniv.isInitialized) {
    return <div>app initializing....</div>;
  }

  console.log('안일어나겠지?')

  return <AppContext.Provider value={myUniv}>{children}</AppContext.Provider>;
});
