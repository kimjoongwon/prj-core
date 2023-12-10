import { User } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useUserColumns = () => {
  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('email', {
      header: '이메일',
    }),
  ];
  return columns;
};
