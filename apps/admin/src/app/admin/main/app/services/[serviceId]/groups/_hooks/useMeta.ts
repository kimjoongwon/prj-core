import { DateCell, GroupDto } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

export const useMeta = () => {
  const columnHelper = createColumnHelper<GroupDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '그룹명',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return {
    columns,
  };
};
