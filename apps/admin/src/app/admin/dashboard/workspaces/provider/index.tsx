'use client';

import { ContainerProps } from '@kimjwally/ui';
import { Workspace } from '@__generated__/graphql';
import { createContext } from 'react';
import { Table } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useHandlers, useMeta, useQueries, useState, useTable } from './hooks';
interface PageContext {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
  table: Table<Workspace>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries(state);
  const handlers = useHandlers(state);
  const meta = useMeta(handlers);
  const table = useTable(queries);

  return (
    <PageContext.Provider
      value={{
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
