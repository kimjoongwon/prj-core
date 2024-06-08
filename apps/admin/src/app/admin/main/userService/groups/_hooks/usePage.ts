import { DateCell, GroupDto } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

import { useQueries } from './useQueries';
import { useMeta } from './useMeta';

export const usePage = () => {
  const { groups } = useQueries();
  const { columns } = useMeta();

  return {
    dataGrid: {
      data: groups,
      columns,
    },
  };
};
