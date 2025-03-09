import { ActionsCell, DateCell } from '@shared/frontend';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export class ColumnService {
  private static commonColumns = [
    {
      header: '생성일',
      accessorKey: 'createdAt',
      cell: DateCell,
    },
    // columnHelper.accessor('createdAt', {
    //   header: '생성일',
    //   cell: DateCell,
    // }),
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
