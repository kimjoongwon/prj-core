'use client';

import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import { useHandlers, useMeta, useQueries } from './hooks';

interface PageProviderProps {
  children: React.ReactNode;
}

interface PageContext {
  meta: ReturnType<typeof useMeta>;
  queries: ReturnType<typeof useQueries>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: PageProviderProps) => {
  const { children } = props;
  const handlers = useHandlers();
  const meta = useMeta(handlers);
  const queries = useQueries();

  return (
    <PageContext.Provider
      value={{
        meta,
        queries,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
