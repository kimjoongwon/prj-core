import { User } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useUserColumns = () => {
  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('email', {
      header: '이메일',
    }),
  ];
  return columns;
};
