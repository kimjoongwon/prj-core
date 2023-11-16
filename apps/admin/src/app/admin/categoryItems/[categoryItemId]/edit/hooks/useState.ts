import { CategoryItemForm } from '@__generated__/graphql';
import { reaction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const {
    categoryItemFormQuery: {
      data: { categoryItemForm },
    },
  } = context;

  const formState = useLocalObservable<CategoryItemForm>(() => ({
    name: categoryItemForm.name,
    parentId: categoryItemForm.parentId,
    ancestorIds: categoryItemForm.ancestorIds,
    tag: categoryItemForm.tag,
    tenantId: categoryItemForm.tenantId,
  }));

  return {
    formState,
  };
};
