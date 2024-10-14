import { createColumnHelper } from '@tanstack/react-table';
import { CategoryDto } from '../../../../model';
import { LinkCell } from '../../../cells';
import { useParams } from 'next/navigation';

export const useColumns = () => {
  const columnHelper = createColumnHelper<CategoryDto>();
  const { serviceId = '' } = useParams<{ serviceId: string }>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
      cell: props => (
        <LinkCell
          value={props.getValue()}
          href={`/admin/main/app/services/${serviceId}/categories/${props.row.original.id}`}
        />
      ),
    }),
    columnHelper.accessor('ancestorIds', {
      header: '상위 카테고리',
      cell: props => {
        const { ancestorIds } = props.row.original;
        const categoryNames = props.table
          .getRowModel()
          .rows.filter(row => ancestorIds.includes(row.original.id))
          .map(row => row.original.name);

        return <div>{categoryNames.join(' > ')}</div>;
      },
    }),
  ];

  return columns;
};
