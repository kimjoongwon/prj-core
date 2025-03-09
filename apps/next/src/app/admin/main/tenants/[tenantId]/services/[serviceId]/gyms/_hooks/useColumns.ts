import { ColumnService } from '@/services/columnService';
import { GymDto } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

export const useColumns = () => {
  const columnHelper = createColumnHelper<GymDto>();
  const actionsColumn = ColumnService.getActionColumns();
  const commonColumns = ColumnService.getCommonColumns();

  const columns = [
    columnHelper.accessor('space.name', {
      header: '이름',
    }),
    columnHelper.accessor('address', {
      header: '주소',
    }),
    columnHelper.accessor('phone', {
      header: '전화번호',
    }),
    // actionsColumn,
    ...commonColumns,
  ];

  return columns;
};
