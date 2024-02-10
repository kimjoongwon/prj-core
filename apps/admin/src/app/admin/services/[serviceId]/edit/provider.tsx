'use client';

import { Form } from '@coc/shared';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import {
  useHandlers,
  useMeta,
  useMutations,
  useQueries,
  useState,
} from './hooks';
import { useSchemas } from './hooks/useSchema';
interface CategoryEditProviderProps {
  children: React.ReactNode;
}

interface ServiceEditPageContext {
  meta: ReturnType<typeof useMeta>;
}

export const ServiceEditPageContext = createContext<ServiceEditPageContext>(
  {} as ServiceEditPageContext,
);

export const ServiceEditPageProvider = observer(
  (props: CategoryEditProviderProps) => {
    const queries = useQueries();
    const mutations = useMutations();
    const state = useState({ ...queries });
    const schemas = useSchemas();
    const handlers = useHandlers({ ...mutations, ...state });
    const meta = useMeta({ ...state, ...handlers, ...schemas });
    const { form } = meta;

    return (
      <ServiceEditPageContext.Provider
        value={{
          meta,
        }}
      >
        <Form
          state={form.state}
          schema={form.schema}
          title={'서비스'}
          onClickSave={form.buttons.onClickSave}
          onClickCancel={form.buttons.onClickCancel}
        >
          {props.children}
        </Form>
      </ServiceEditPageContext.Provider>
    );
  },
);
