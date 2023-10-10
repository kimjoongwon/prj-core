'use client';

import { ContainerProps } from '@coc/ui';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useMeta, useQueries, useState, useTable } from './hooks';
import { useHandlers } from './hooks/useHandlers';

interface PageContext {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
  table: ReturnType<typeof useTable>;
  handlers: ReturnType<typeof useHandlers>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries(state);
  const handlers = useHandlers(state);
  const meta = useMeta();
  const table = useTable({ ...queries, ...meta });

  return (
    <PageContext.Provider
      value={{
        handlers,
        state,
        meta,
        table,
        queries,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
