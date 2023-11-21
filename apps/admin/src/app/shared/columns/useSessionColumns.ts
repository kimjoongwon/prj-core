import { Session } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useSessionColumns = () => {
  const columnHelper = createColumnHelper<Session>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
  ];
  return columns;
};
