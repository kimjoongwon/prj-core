'use client';

import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ContainerProps } from '@coc/ui';
import { useHandlers, useMeta, useQueries, useState } from './hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
  handlers: ReturnType<typeof useHandlers>;
  meta: ReturnType<typeof useMeta>;
}

export const SessionsPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const SessionsPageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries({ state });
  const handlers = useHandlers({ state });
  const meta = useMeta();

  return (
    <SessionsPageContext.Provider
      value={{
        state,
        queries,
        handlers,
        meta,
      }}
    >
      {children}
    </SessionsPageContext.Provider>
  );
});
