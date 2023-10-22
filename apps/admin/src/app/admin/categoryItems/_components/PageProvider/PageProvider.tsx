'use client';

import { ContainerProps } from '@coc/ui';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useHandlers, useQueries, useState, useMeta } from '../../_hooks';

interface PageContext {
  state: ReturnType<typeof useState>;
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const handlers = useHandlers(state);
  const queries = useQueries(state);
  const meta = useMeta({ ...queries, ...handlers });
  console.log('?');
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
