import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  TableProps,
  SortDescriptor,
  Selection,
} from '@nextui-org/react';

import {
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { v4 } from 'uuid';

export interface DataGridProps<T> {
  selectionMode: TableProps['selectionMode'];
  data: any[];
  columns: any[];
  onSortChange?: (sort: { key: string; value: 'asc' | 'desc' }) => void;
  onSelectionChange?: (selectedRowIds: string[]) => void;
}

export function DataGrid<T extends any>(props: DataGridProps<T>) {
  const { selectionMode, data, columns, ...rest } = props;

  const table = useReactTable({
    data: data as T[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows as Row<T & { id: string }>[];
  const headers = table.getLeafHeaders();

  return (
    <table {...rest}>
      <thead>
        {headers?.map(header => (
          <tr key={header.column.id}>
            {header.isPlaceholder ? (
              <></>
            ) : (
              <th>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            )}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows?.map(row => (
          <tr key={row.original.id}>
            {row
              .getVisibleCells()
              ?.map(cell => (
                <td key={v4()}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
