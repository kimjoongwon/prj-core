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
import { ButtonProps, Spacer } from '@nextui-org/react';
import { TableContainer } from './TableContainer';
import { HStack } from '../HStack';
import { renderButton } from '../../renderer/renderButton';

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const { data, columns, leftButtons, rightButtons } = props;

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
    <TableContainer>
      <HStack className="justify-between">
        <HStack>{leftButtons?.map(renderButton)}</HStack>
        <HStack>{rightButtons?.map(renderButton)}</HStack>
      </HStack>
      <Spacer y={1} />
      <table className="font-pretendard border-1">
        <TableHead table={table} />
        <TableBody table={table} />
        <TableFooter table={table} />
      </table>
    </TableContainer>
  );
}
