'use client';

import { ContainerProps } from '@coc/shared';
import { createContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useHandlers, useQueries, useState } from './hooks';
import { useMutations } from './hooks/useMutations';

interface PageContext {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  handlers: ReturnType<typeof useHandlers>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const queries = useQueries();
  const state = useState();
  const mutations = useMutations();
  const handlers = useHandlers({
    state,
    mutations,
  });

  return (
    <PageContext.Provider
      value={{
        queries,
        state,
        handlers,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
