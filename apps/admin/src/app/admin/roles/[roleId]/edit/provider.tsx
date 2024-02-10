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

export const RoleEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const RoleEditPageProvider = observer((props: ContainerProps) => {
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

  const { roleFormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  return (
    <RoleEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="카테고리"
        state={state.form}
        schema={roleFormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </RoleEditPageContext.Provider>
  );
});
