'use client';

import { ContainerProps } from '@coc/shared';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useHandlers, useMeta, useQueries, useState } from './hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
  handlers: ReturnType<typeof useHandlers>;
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>(
  {} as PageContext,
);

export const UsersPageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries(state);
  const handlers = useHandlers(state);
  const meta = useMeta();

  return (
    <PageContext.Provider
      value={{
        meta,
        state,
        queries,
        handlers,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
