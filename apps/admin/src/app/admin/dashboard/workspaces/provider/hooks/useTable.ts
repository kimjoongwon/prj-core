import { User } from '@__generated__/graphql';
import { useQueries } from './useQueries';
import { useCoCTable } from '@hooks';
import { useUserColumns } from '@columns';

export const useTable = ({ userQuery }: ReturnType<typeof useQueries>) => {
  const table = useCoCTable<User>({
    data: userQuery.data?.users?.nodes || [],
    columns: useUserColumns(),
  });

  return table;
};
