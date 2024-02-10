'use client';

import { ContainerProps, Form } from '@coc/shared';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import {
  useHandlers,
  useMutations,
  useQueries,
  useSchemas,
  useState,
} from './hooks';

interface PageContext {
  handlers: ReturnType<typeof useHandlers>;
  schemas: ReturnType<typeof useSchemas>;
  state: ReturnType<typeof useState>;
}

export const SessionEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const SessionEditPageProvider = observer((props: ContainerProps) => {
  const { children } = props;

  const queries = useQueries();
  const mutations = useMutations();
  const state = useState({
    queries,
  });

  const handlers = useHandlers({
    mutations,
    state,
  });
  const schemas = useSchemas();

  const { sessionFormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  return (
    <SessionEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="Session 편집"
        state={state.form}
        schema={sessionFormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </SessionEditPageContext.Provider>
  );
});
