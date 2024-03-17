'use client';

import { Form } from '@coc/web';
import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
import { useCategoryItemsPage } from '../../hooks';
import { useHandlers, useMutations, useQueries, useState } from './hooks';
import { useSchemas } from './hooks/useSchemas';
interface CategoryEditProviderProps {
  children: React.ReactNode;
}

interface PageContext {
  context: {
    categoryItemsPage: ReturnType<typeof useCategoryItemsPage>;
  };
  form: {
    state: ReturnType<typeof useState>['formState'];
    schema: ReturnType<typeof useSchemas>['categoryItemSchema'];
    buttons: {
      onClickSave: ReturnType<typeof useHandlers>['onClickSave'];
      onClickCancel: ReturnType<typeof useHandlers>['onClickCancel'];
    };
  };
}

export const PageContext = createContext<PageContext>({} as PageContext);

export const CategoryItemEditPageProvider = observer(
  (props: CategoryEditProviderProps) => {
    const categoryItemsPage = useCategoryItemsPage();
    const queries = useQueries();
    const mutations = useMutations();
    const state = useState({ ...queries });
    const schemas = useSchemas();
    const handlers = useHandlers({
      mutations,
      state,
      categoryItemsPage,
    });

    return (
      <PageContext.Provider
        value={{
          context: {
            categoryItemsPage,
          },
          form: {
            state: state.formState,
            schema: schemas.categoryItemSchema,
            buttons: {
              onClickSave: handlers.onClickSave,
              onClickCancel: handlers.onClickCancel,
            },
          },
        }}
      >
        <Form
          title="카테고리"
          state={state.formState}
          schema={schemas.categoryItemSchema}
          onClickSave={handlers.onClickSave}
          onClickCancel={handlers.onClickCancel}
        >
          {props.children}
        </Form>
      </PageContext.Provider>
    );
  },
);
