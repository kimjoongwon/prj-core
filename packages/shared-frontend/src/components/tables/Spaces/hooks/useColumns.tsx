import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { SpaceDto } from '../../../../model/spaceDto';
import { LinkCell } from '../../../cells/Link';
import { useParams } from 'next/navigation';

export const useColumns = () => {
  const columnHelper = createColumnHelper<SpaceDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
      cell: props => {
        const href = `/admin/main/gym/spaces/${props.row.original.id}`;
        return <LinkCell value={props.getValue()} href={href} />;
      },
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
    columnHelper.accessor('removedAt', {
      header: '삭제일',
      cell: DateCell,
    }),
  ];

  return columns;
};
