import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../components/cells/Date/DateCell';
import { ActionsCell } from '../components/cells/Actions/ActionsCell';

const columnHelper = createColumnHelper();

export class ColumnService {
  commonColumns = [
    {
      header: '생성일',
      accessorKey: 'createdAt',
      cell: DateCell,
    },
  ];

  _actionColumn = columnHelper.display({
    id: 'action',
    cell: ActionsCell,
  });

  getCommonColumns() {
    return this.commonColumns;
  }

  getActionColumns() {
    return this._actionColumn;
  }
}
