'use client';

import { ContainerProps, Form } from '@coc/ui';
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

export const WorkspaceEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const WorkspaceEditPageProvider = observer((props: ContainerProps) => {
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

  const { workspaceFormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  return (
    <WorkspaceEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="소속"
        state={state.form}
        schema={workspaceFormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </WorkspaceEditPageContext.Provider>
  );
});
