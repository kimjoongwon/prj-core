'use client';

import { ContainerProps } from '@coc/shared';
import { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useHandlers,
  useMeta,
  useMutations,
  useQueries,
  useStates,
} from './_hooks';

interface PageContext {
  state: ReturnType<typeof useStates>;
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: ContainerProps) => {
  const { children } = props;
  const state = useStates();
  const queries = useQueries(state);
  const handlers = useHandlers(state);
  const mutations = useMutations();

  const meta = useMeta({
    ...queries,
    ...handlers,
    ...mutations,
    ...state,
  });

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
