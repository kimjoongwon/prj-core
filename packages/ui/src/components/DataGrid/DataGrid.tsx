'use client';

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

  const firstHeaderGroup = table.getHeaderGroups()[0];
  const firstHeaders = firstHeaderGroup.headers;

  return (
    <Table>
      <TableHeader>
        {firstHeaders?.map(header => (
          <TableColumn key={header.id} aria-label={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.map(row => (
          <TableRow key={row.id} aria-label={row.id}>
            {row.getVisibleCells()?.map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const DataGrid = _DataGrid;
