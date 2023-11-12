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

export const CategoryEditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const CategoryEditPageProvider = observer((props: ContainerProps) => {
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

  const { categoryFormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  const { children } = props;

  return (
    <CategoryEditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="카테고리"
        state={state.form}
        schema={categoryFormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </CategoryEditPageContext.Provider>
  );
});
