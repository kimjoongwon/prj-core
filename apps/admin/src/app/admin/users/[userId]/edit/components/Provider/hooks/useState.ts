import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';
import { useDefaultObjects } from './useDefaultObjects';

export const useState = (
  context: ReturnType<typeof useQueries> & ReturnType<typeof useDefaultObjects>,
) => {
  const {
    userFormQuery: { data },
  } = context;

  const state = useLocalObservable(() => data.userForm);

  return state;
};
