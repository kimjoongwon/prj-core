import { GroupForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { groupFormQuery } = queries;
  const groupForm = groupFormQuery?.data?.groupForm;

  const formState = useLocalObservable<GroupForm>(() => groupForm);
  return { form: formState };
};
