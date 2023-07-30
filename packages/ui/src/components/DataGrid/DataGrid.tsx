import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
}

function _DataGrid<T extends object>(props: DataGridProps<T>) {
  const { data, columns } = props;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <th>
        {table.getHeaderGroups()?.map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers?.map(header => (
              <td key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </td>
            ))}
          </tr>
        ))}
      </th>
      <tbody>
        {table.getRowModel().rows?.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells()?.map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const DataGrid = observer(_DataGrid);
