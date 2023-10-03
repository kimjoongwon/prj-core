import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';
import { defaultsDeep } from 'lodash-es';
import { SignupInput } from '@__generated__/graphql';
import { useDefaultObjects } from './useDefaultObjects';

export const useState = (
  context: ReturnType<typeof useQueries> & ReturnType<typeof useDefaultObjects>,
) => {
  const {
    userDefaultObject,
    userQuery: { data },
  } = context;

  const user = defaultsDeep({ ...data?.user, password: '' }, userDefaultObject);
  const state = useLocalObservable(() => user);

  return state;
};
