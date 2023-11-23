import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = (context: ReturnType<typeof useQueries>) => {
  const {
    userFormQuery: { data },
  } = context;

  const formState = useLocalObservable(() => ({
    ...data.userForm,
    test: [],
  }));
  return {
    formState,
  };
};
