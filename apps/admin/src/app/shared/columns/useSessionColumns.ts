import { Session } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useSessionColumns = () => {
  const columnHelper = createColumnHelper<Session>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
    }),
  ];

  return columns;
};
