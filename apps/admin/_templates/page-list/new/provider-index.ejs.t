---
to: src/app/admin/dashboard/<%= name %>/provider/index.tsx
unless_exists: true
---
'use client';

import { ContainerProps } from '@kimjwally/ui';
import { <%= h.inflection.singularize(Name) %> } from '@__generated__/graphql';
import { createContext } from 'react';
import { Table } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useHandlers, useMeta, useQueries, useState, useTable } from './hooks';
interface PageContext {
  data: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
  table: Table<<%= h.inflection.singularize(Name) %>>;
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
