import { SpaceForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { spaceFormQuery } = queries;
  const spaceForm = spaceFormQuery?.data?.spaceForm;

  const formState = useLocalObservable<SpaceForm>(() => spaceForm);
  return { form: formState };
};
