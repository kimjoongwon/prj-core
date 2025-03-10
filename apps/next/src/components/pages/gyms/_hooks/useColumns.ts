import { GymDto, useApp } from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';

export const useColumns = () => {
  const app = useApp();
  const columnHelper = createColumnHelper<GymDto>();
  const actionsColumn = app.columnService.getActionColumns();
  const commonColumns = app.columnService.getCommonColumns();

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
