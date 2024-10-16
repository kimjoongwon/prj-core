import { createColumnHelper } from '@tanstack/react-table';
import { ClassificationDto } from '../../../../model/classificationDto';
import { LinkCell } from '../../../cells/Link';
import { useParams } from 'next/navigation';

export const useColumns = () => {
  const columnHelper = createColumnHelper<ClassificationDto>();
  const { serviceId } = useParams<{ serviceId: string }>();

  const columns = [
    columnHelper.accessor('category.name', {
      header: '카테고리명',
      cell: props => (
        <LinkCell
          value={props.getValue()}
          href={`/admin/main/app/services/${serviceId}/classifications/${props.row.original.id}`}
        />
      ),
    }),
    columnHelper.accessor('service.label', {
      header: '서비스명',
    }),
    columnHelper.accessor(undefined, {
      header: '서비스 아이템',
      cell: props => {
        const serviceName = props.row.original.service.name;
        const serviceItem = props.row.original[serviceName];
        return <div>{serviceItem?.name || '-'}</div>;
      },
    }),
  ];

  return columns;
};
