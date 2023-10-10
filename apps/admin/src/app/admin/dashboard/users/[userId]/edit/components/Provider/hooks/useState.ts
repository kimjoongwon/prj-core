import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';
import { SignupInput, UpdateUserInput } from '@__generated__/graphql';
import { useDefaultObjects } from './useDefaultObjects';
import { useParams } from 'next/navigation';

export const useState = (
  context: ReturnType<typeof useQueries> & ReturnType<typeof useDefaultObjects>,
) => {
  const {
    userDefaultObject,
    userQuery: { data },
  } = context;
  const { userId } = useParams();
  console.log(data?.user, 'id?');
  const user =
    userId === 'new' ? userDefaultObject : (data?.user as UpdateUserInput);

  const state = useLocalObservable<SignupInput>(() => user as SignupInput);

  return state;
};
