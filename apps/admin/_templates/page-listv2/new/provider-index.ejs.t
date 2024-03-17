---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/provider.tsx
unless_exists: true
---
'use client';

import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ContainerProps } from '@coc/web';
import { useHandlers, useMeta, useQueries, useState } from './hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
  handlers: ReturnType<typeof useHandlers>;
  meta: ReturnType<typeof useMeta>;
}

export const <%= Name %>sPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const <%= Name %>sPageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries({ state });
  const handlers = useHandlers({ state });
  const meta = useMeta();

  return (
    <<%= Name %>sPageContext.Provider
      value={{
        state,
        queries,
        handlers,
        meta,
      }}
    >
      {children}
    </<%= Name %>sPageContext.Provider>
  );
});
