import { Role } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const useRoleColumns = () => {
  const columnHelper = createColumnHelper<Role>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
    }),
  ];
  return columns;
};
