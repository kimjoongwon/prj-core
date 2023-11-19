import { RoleForm } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useQueries } from './useQueries';

export const useState = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { roleFormQuery } = queries;
  const roleForm = roleFormQuery?.data?.roleForm;

  const formState = useLocalObservable<RoleForm>(() => roleForm);
  return { form: formState };
};
