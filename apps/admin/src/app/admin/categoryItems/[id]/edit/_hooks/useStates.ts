import { CategoryItemForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useStates = (context: ReturnType<typeof useQueries>) => {
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
  }));

  return {
    formState,
  };
};
