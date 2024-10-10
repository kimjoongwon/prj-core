import { createColumnHelper } from '@tanstack/react-table';
import { AssignmentDto } from '../../../../model/assignmentDto';

export const useColumns = () => {
  const columnHelper = createColumnHelper<AssignmentDto>();

  const columns = [
    columnHelper.accessor('group.name', {
      header: '그룹명',
    }),
    columnHelper.accessor('service.name', {
      header: '서비스명',
    }),
    columnHelper.accessor(undefined, {
      header: '서비스 아이템',
      cell: props => {
        const serviceName = props.row.original.service.name;
        const serviceItem = props.row.original[serviceName];
        return <div>{serviceItem.name}</div>;
      },
    }),
  ];

  return columns;
};
