import {
  ColumnDef,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import React from 'react';

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const { data, columns } = props;

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [grouping, setGrouping] = React.useState<GroupingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    state: {
      grouping,
      columnVisibility,
      rowSelection,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <table className="border-1">
      <TableHead table={table} />
      <TableBody table={table} />
      <TableFooter table={table} />
    </table>
  );
}
