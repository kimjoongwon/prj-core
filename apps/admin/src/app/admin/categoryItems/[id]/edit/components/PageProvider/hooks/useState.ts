import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const { categoryFormQuery } = context;

  const state = useLocalObservable(() => categoryFormQuery.data.categoryForm);

  return state;
};
