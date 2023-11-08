import { Workspace } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../components/cells';

export const useWorkspaceColumns = () => {
  const columnHelper = createColumnHelper<Workspace>();

  const columns = [
    // columnHelper.accessor('id', {
    //   header: '아이디',
    // }),
    columnHelper.accessor('name', {
      header: '소속명',
    }),
    columnHelper.accessor('address', {
      header: '주소',
    }),
    columnHelper.accessor('businessNumber', {
      header: '사업자번호',
    }),
    columnHelper.accessor('phone', {
      header: '전화번호',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
    columnHelper.accessor('updatedAt', {
      header: '수정일',
      cell: DateCell,
    }),
  ];
  return columns;
};
