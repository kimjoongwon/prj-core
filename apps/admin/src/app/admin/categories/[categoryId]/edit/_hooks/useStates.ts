import { CategoryForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useStates = (context: ReturnType<typeof useQueries>) => {
  const { categoryFormQuery } = context;
  const categoryForm = categoryFormQuery?.data?.categoryForm;

  const formState = useLocalObservable<CategoryForm>(() => categoryForm);
  return { formState };
};
