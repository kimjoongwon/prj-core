'use client';

import React from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
  Selection,
  ButtonProps,
  SortDescriptor,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from '@nextui-org/react';
import { TableContainer } from './TableContainer';
import { HStack } from '../HStack';
import { observer } from 'mobx-react-lite';
import { Pagination } from '../Pagination';

export type Key = string | number;

export type PageQuery = {
  take?: number;
  skip?: number;
};

export type TableQuery = {
  [key: string]: any;
} & PageQuery;

export type DataGridState<T> = {
  currentSort?: SortDescriptor;
  selection?: Selection;
  query?: TableQuery & T;
};

export interface DataGridProps<T> extends TableProps {
  state?: DataGridState<T>;
  data: T[];
  columns: ColumnDef<T, any>[];
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
  hideButtons?: boolean;
  actions?: ('삭제' | '생성' | '제거')[];
  selectedKey?: string;
  emptyContent?: string;
  totalCount?: number;
}

export const DataGrid = observer(
  <
    T extends {
      id: string;
    },
  >(
    props: DataGridProps<T>,
  ) => {
    const {
      data,
      columns = [],
      leftButtons = [],
      rightButtons = [],
      selectedKey = 'id',
      state,
      emptyContent = '데이터가 없습니다.',
      totalCount,
      hideButtons,
    } = props;

    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [grouping, setGrouping] = React.useState<GroupingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getSubRows: (row: any) => row?.children || [],
      getExpandedRowModel: getExpandedRowModel(),
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      onColumnVisibilityChange: setColumnVisibility,
      onGroupingChange: setGrouping,
      onRowSelectionChange: setRowSelection,
      state: {
        grouping,
        columnVisibility,
        rowSelection,
        expanded,
      },
      onExpandedChange: setExpanded,
      debugTable: false,
      debugHeaders: false,
      debugColumns: false,
    });

    if (!table) return null;

    if (columns.length === 0) {
      throw new Error('columns is empty');
    }

    const headers = table?.getHeaderGroups?.()?.[0]?.headers || [];
    const rows = table?.getRowModel?.()?.rows || [];

    return (
      <TableContainer>
        {!hideButtons && (
          <>
            <HStack className="w-full">
              <HStack className="w-full justify-start">
                {leftButtons?.map(renderButton)}
              </HStack>
              <HStack className="w-full justify-end space-x-2">
                {rightButtons?.map(renderButton)}
              </HStack>
            </HStack>
            <Spacer y={1} />
          </>
        )}
        <Table
          defaultSelectedKeys={state?.selection}
          onSelectionChange={(selection: Selection) => {
            state.selection = selection;
          }}
        >
          <TableHeader columns={headers}>
            {header => {
              return (
                <TableColumn key={header.column.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableColumn>
              );
            }}
          </TableHeader>
          <TableBody emptyContent={emptyContent} items={rows}>
            {row => {
              return (
                <TableRow key={row.original?.[selectedKey as string]}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell?.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
        <Spacer y={4} />
        {!!state?.query?.take && (
          <Pagination totalCount={totalCount} state={state?.query} />
        )}
      </TableContainer>
    );
  },
);
