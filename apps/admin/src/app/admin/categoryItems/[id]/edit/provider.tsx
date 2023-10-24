'use client';

import { Form } from '@coc/ui';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { createContext } from 'react';
import {
  useHandlers,
  useMeta,
  useMutations,
  useQueries,
  useState,
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
  const state = useState({ ...queries });
  const handlers = useHandlers({ ...mutations, ...state });
  const meta = useMeta({ ...state, ...handlers });
  const schemas = useSchemas();
  const { isEditMode, form } = meta;
  return (
    <PageContext.Provider
      value={{
        meta,
      }}
    >
      <Form
        state={
          !isEditMode
            ? form.state.createCategoryItemInput
            : form.state.updateCategoryItemInput
        }
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
