'use client';

import { SignupInput } from '@__generated__/graphql';
import { ContainerProps } from '@kimjwally/ui';
import { observer } from 'mobx-react-lite';
import { createContext, useMemo } from 'react';
import {
  useDefaultObjects,
  useMeta,
  useMutations,
  useQueries,
  useState,
} from './hooks';
import { UserSchema, userSchema } from '@schemas';

interface PageContext {
  schema: UserSchema;
  state: SignupInput;
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const PageProvider = observer((props: ContainerProps) => {
  const queries = useQueries();
  const defaultObjects = useDefaultObjects();
  const state = useState({ ...queries, ...defaultObjects });
  const mutations = useMutations(state);
  const meta = useMeta(mutations);

  return (
    <PageContext.Provider
      value={{
        meta,
        state,
        schema: userSchema,
      }}
    >
      {props.children}
    </PageContext.Provider>
  );
});
