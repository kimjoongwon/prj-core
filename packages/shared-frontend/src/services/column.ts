import { createColumnHelper } from '@tanstack/react-table';
import { DateCell } from '../components/cells/Date/DateCell';
import { ActionsCell } from '../components/cells/Actions/ActionsCell';

const columnHelper = createColumnHelper();

export class ColumnService {
  private static commonColumns = [
    {
      header: '생성일',
      accessorKey: 'createdAt',
      cell: DateCell,
    },
  ];

  private static _actionColumn = columnHelper.display({
    id: 'action',
    cell: ActionsCell,
  });

  static getCommonColumns() {
    return this.commonColumns;
  }

  static getActionColumns() {
    return this._actionColumn;
  }
}
