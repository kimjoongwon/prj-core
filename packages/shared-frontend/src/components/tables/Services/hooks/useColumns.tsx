import { createColumnHelper } from '@tanstack/react-table';
import { ServiceDto } from '../../../../model/serviceDto';
import { galaxy } from '../../../../providers/App';
export const useColumns = () => {
  const columnHelper = createColumnHelper<ServiceDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
      cell: props => {
        return (
          <div
            onClick={() =>
              galaxy.router.push({
                url: '/admin/main/services/:serviceId',
                params: { serviceId: props.row.original.id },
              })
            }
          >
            {props.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('label', {
      header: '라벨',
    }),
  ];

  return columns;
};
