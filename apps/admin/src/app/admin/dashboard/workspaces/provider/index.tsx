'use client';

import { ContainerProps } from '@kimjwally/ui';
import { User } from '@__generated__/graphql';
import { createContext } from 'react';
import { Table } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useHandlers, useMeta, useQueries, useState, useTable } from './hooks';
interface PageContext {
  data: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
  table: Table<User>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const data = useQueries(state);
  const handlers = useHandlers(state);
  const meta = useMeta(handlers);
  const table = useTable(data);

  return (
    <PageContext.Provider
      value={{
        state,
        meta,
        table,
        data,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
