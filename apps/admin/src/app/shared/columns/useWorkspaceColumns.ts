import { Workspace } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useWorkspaceColumns = () => {
  const columnHelper = createColumnHelper<Workspace>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('name', {
      header: 'WorkspaceName',
    }),
    columnHelper.accessor('owner.email', {
      header: 'OwnerEmail',
    }),
  ];
  return columns;
};
