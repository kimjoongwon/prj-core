'use client';

import { ContainerProps } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import {
  useDefaultObjects,
  useHandlers,
  useMutations,
  useQueries,
  useState,
} from './hooks';
import { UserSchema, userSchema } from '@schemas';

interface PageContext {
  schema: UserSchema;
  state: ReturnType<typeof useState>;
  handlers: ReturnType<typeof useHandlers>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: ContainerProps) => {
  const queries = useQueries();
  const defaultObjects = useDefaultObjects();
  const state = useState({ ...queries, ...defaultObjects });
  const mutations = useMutations(state);
  const handlers = useHandlers({ state, mutations });

  return (
    <PageContext.Provider
      value={{
        handlers,
        state,
        schema: userSchema,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
});
