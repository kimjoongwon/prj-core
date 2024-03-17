---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/provider.tsx
---
'use client';

import { ContainerProps, Form } from '@coc/web';
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

export const <%= Name %>EditPageContext = createContext<PageContext>(
  {} as PageContext,
);

export const <%= Name %>EditPageProvider = observer((props: ContainerProps) => {
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

  const { <%= name %>FormSchema } = schemas;
  const { onClickCancel, onClickSave } = handlers;

  return (
    <<%= Name %>EditPageContext.Provider
      value={{
        handlers,
        schemas,
        state,
      }}
    >
      <Form
        title="카테고리"
        state={state.form}
        schema={<%= name %>FormSchema}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      >
        {children}
      </Form>
    </<%= Name %>EditPageContext.Provider>
  );
});
