import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { SessionDto } from '../../../../model/sessionDto';
import { LinkCell } from '../../../cells/Link';

export const useColumns = () => {
  const columnHelper = createColumnHelper<SessionDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '제목',
      cell: props => {
        return (
          <LinkCell
            value={props.getValue()}
            href={`/admin/main/reservation/sessions/${props.row.original.id}`}
          />
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
