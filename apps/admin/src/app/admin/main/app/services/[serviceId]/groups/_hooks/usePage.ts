import { useQueries } from './useQueries';
import { useMeta } from './useMeta';

export const usePage = () => {
  const { getGroupsByQuery } = useQueries();
  const { columns } = useMeta();

  return {
    dataGrid: {
      data: getGroupsByQuery?.data?.data || [],
      columns,
    },
  };
};
