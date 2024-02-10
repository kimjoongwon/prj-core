'use client';

import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ContainerProps } from '@coc/shared';
import { useHandlers, useMeta, useQueries, useState } from './hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
  handlers: ReturnType<typeof useHandlers>;
  meta: ReturnType<typeof useMeta>;
}

export const ServicesPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const ServicesPageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries({ state });
  const handlers = useHandlers({ state });
  const meta = useMeta();

  return (
    <ServicesPageContext.Provider
      value={{
        state,
        queries,
        handlers,
        meta,
      }}
    >
      {children}
    </ServicesPageContext.Provider>
  );
});
