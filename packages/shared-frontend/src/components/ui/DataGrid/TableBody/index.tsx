import { Row, RowData, Table, flexRender } from '@tanstack/react-table';

interface TableBodyProps<T> {
  table: Table<T>;
}

export const TableBody = <T extends any>(props: TableBodyProps<T>) => {
  const { table } = props;
  return (
    <tbody>
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {getRowGroup(row, 'center').map(cell => (
            <td
              key={cell.id}
              style={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

type TableGroup = 'center' | 'left' | 'right';

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === 'left') return row.getLeftVisibleCells();
  if (tg === 'right') return row.getRightVisibleCells();
  if (tg === 'center') return row.getCenterVisibleCells();
  return row.getVisibleCells();
}
