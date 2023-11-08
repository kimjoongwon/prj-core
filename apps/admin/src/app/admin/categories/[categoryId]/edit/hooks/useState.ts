import { CategoryForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { categoryFormQuery } = queries;
  const categoryForm = categoryFormQuery?.data?.categoryForm;

  const formState = useLocalObservable<CategoryForm>(() => categoryForm);
  return { form: formState };
};
