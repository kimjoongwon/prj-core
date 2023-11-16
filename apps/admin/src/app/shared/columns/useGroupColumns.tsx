import { Group } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useGroupColumns = () => {
  const columnHelper = createColumnHelper<Group>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('name', {
      header: '이름',
    }),
  ];
  return columns;
};
