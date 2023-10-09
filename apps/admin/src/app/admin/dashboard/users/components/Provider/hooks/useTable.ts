import { User } from '@__generated__/graphql';
import { useQueries } from './useQueries';
import { useCoCTable } from '@hooks';
import { useMeta } from './useMeta';

export const useTable = ({
  usersQuery,
  columns,
}: ReturnType<typeof useQueries> & ReturnType<typeof useMeta>) => {
  const table = useCoCTable<User>({
    data: usersQuery.data?.users?.nodes || [],
    columns,
  });

  return {
    instance: table,
    data: usersQuery?.data?.users.nodes,
    totalCount: usersQuery?.data?.users.pageInfo?.totalCount || 1,
  };
};
