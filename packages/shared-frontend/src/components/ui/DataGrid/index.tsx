import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table';
import { renderButton } from '../../renderer/renderButton';
import {
  ButtonProps,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { TableContainer } from './TableContainer';
import { HStack } from '../HStack';

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
  actions?: ('삭제' | '생성' | '제거')[];
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

  if (!table) return null;

  const headers = table?.getHeaderGroups?.()?.[0]?.headers || [];
  const rows = table?.getRowModel?.()?.rows || [];

  return (
    <TableContainer>
      <HStack className="w-full">
        <HStack className="w-full justify-start">
          {leftButtons?.map(renderButton)}
        </HStack>
        <HStack className="w-full justify-end space-x-2">
          {rightButtons?.map(renderButton)}
        </HStack>
      </HStack>
      <Spacer y={1} />
      <Table>
        <TableHeader>
          {headers?.map(header => (
            <TableColumn key={header.column.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows?.map(row => (
            <TableRow key={row.id}>
              {row.getAllCells().map(cell => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
