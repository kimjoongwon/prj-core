import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { UserDto } from '../../../../model/userDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<UserDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '그룹명',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
