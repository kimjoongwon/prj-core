'use client';

import { Form } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import {
  useHandlers,
  useMeta,
  useMutations,
  useQueries,
  useStates,
} from './_hooks';
import { useSchemas } from './_hooks/useSchema';
interface CategoryEditProviderProps {
  children: React.ReactNode;
}

interface PageContext {
  meta: ReturnType<typeof useMeta>;
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const Provider = observer((props: CategoryEditProviderProps) => {
  const queries = useQueries();
  const mutations = useMutations();
  const state = useStates({ ...queries });
  const handlers = useHandlers({ ...mutations, ...state });
  const meta = useMeta({ ...state, ...handlers });
  const schemas = useSchemas();
  const { form } = meta;
  return (
    <PageContext.Provider
      value={{
        meta,
      }}
    >
      <Form
        state={form.state}
        schema={schemas.categoryItemSchema}
        title={'카테고리 아이템 생성'}
        onClickSave={form.buttons.onClickSave}
        onClickCancel={form.buttons.onClickCancel}
      >
        {props.children}
      </Form>
    </PageContext.Provider>
  );
});
