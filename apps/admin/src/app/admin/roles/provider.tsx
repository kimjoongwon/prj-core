'use client';

import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ContainerProps } from '@coc/shared';
import { useHandlers, useMeta, useQueries, useState } from './hooks';
import { useMutations } from './hooks/useMutations';

interface PageContext {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
  handlers: ReturnType<typeof useHandlers>;
  meta: ReturnType<typeof useMeta>;
}

export const RolesPageContext = createContext<PageContext>({} as PageContext);

export const RolesPageProvider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useState();
  const queries = useQueries({ state });
  const handlers = useHandlers({ state });
  const mutations = useMutations();
  const meta = useMeta({ mutations, state });

  return (
    <RolesPageContext.Provider
      value={{
        state,
        queries,
        handlers,
        meta,
      }}
    >
      {children}
    </RolesPageContext.Provider>
  );
});
