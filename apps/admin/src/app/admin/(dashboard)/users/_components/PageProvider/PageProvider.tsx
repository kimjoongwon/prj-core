'use client';

import { ContainerProps } from '@coc/ui';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useHandlers, useMeta, useQueries, useState } from '../../_hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries(state);
  const handlers = useHandlers(state);
  const meta = useMeta({ ...queries, ...handlers });

  return (
    <PageContext.Provider
      value={{
        state,
        meta,
      }}
    >
      {children}
    </PageContext.Provider>
  );
});
