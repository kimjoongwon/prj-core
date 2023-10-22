'use client';

import { ContainerProps } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import { useHandlers, useMutations, useQueries, useState } from './hooks';
import { useMeta } from './hooks/useMeta';

interface PageContext {
  meta: ReturnType<typeof useMeta>;
  state: ReturnType<typeof useState>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: ContainerProps) => {
  const queries = useQueries();
  const state = useState({ ...queries });
  const mutations = useMutations(state);
  const handlers = useHandlers(mutations);
  const meta = useMeta({ ...handlers });
  return (
    <PageContext.Provider value={{ meta, state }}>
      {props.children}
    </PageContext.Provider>
  );
});
