import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { GroupDto } from '../../../../model/groupDto';
import { LinkCell } from '../../../cells/Link';
import { useParams } from 'next/navigation';

export const useColumns = () => {
  const columnHelper = createColumnHelper<GroupDto>();
  const { serviceId } = useParams<{ serviceId: string }>();

  const columns = [
    columnHelper.accessor('name', {
      header: '그룹명',
      cell: props => (
        <LinkCell
          value={props.getValue()}
          href={`/admin/main/app/services/${serviceId}/groups/${props.row.original.id}`}
        />
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return columns;
};
