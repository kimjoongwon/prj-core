import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../../../cells/Date/DateCell';
import { ClassificationDto } from '../../../../model/classificationDto';
import { LinkCell } from '../../../cells/Link';
import { useParams } from 'next/navigation';

export const useColumns = () => {
  const columnHelper = createColumnHelper<ClassificationDto>();
  const { serviceId } = useParams<{ serviceId: string }>();

  const columns = [
    columnHelper.accessor('category.name', {
      header: '그룹명',
      cell: props => (
        <LinkCell
          value={props.getValue()}
          href={`/admin/main/app/services/${serviceId}/classifications/${props.row.original.id}`}
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
