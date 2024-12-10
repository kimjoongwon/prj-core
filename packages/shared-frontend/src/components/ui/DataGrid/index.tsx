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
import { difference, uniq } from 'lodash-es';
import { Pagination } from '../Pagination';
import { toJS } from 'mobx';

export type PageQuery = {
  take?: number;
  skip?: number;
};

export type TableQuery = {
  [key: string]: any;
} & PageQuery;

export type DataGridState<T> = {
  currentSort?: SortDescriptor;
  selectedKeys?: string[];
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

export interface CustomDataGridProps
  extends Omit<DataGridProps<any>, 'data' | 'columns'> {}

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
      ...rest
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
    console.log('state.currentSort', state.currentSort);
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
          {...rest}
          defaultSelectedKeys={state?.selectedKeys || []}
          onSelectionChange={selection => {
            if (selection instanceof Set) {
              // @ts-ignore
              state.selectedKeys = Array.from(selection);
              return;
            }
            if (selection === 'all') {
              const allKey =
                // @ts-ignore
                data?.map(row => row?.[selectedKey as string]) || [];
              // @ts-ignore
              state.selectedKeys = uniq([...state.selectedKeys, ...allKey]);
            } else {
              difference(state?.selectedKeys || [], Array.from(selection));
            }
          }}
          sortDescriptor={state?.currentSort || undefined}
          onSortChange={sort => {
            console.log('state', state);
            state.query = {
              ...state?.query,
              [`${sort.column}SortOrder`]:
                sort.direction === 'ascending' ? 'asc' : 'desc',
            };

            console.log(state);
            // window.location.replace(
            //   window.location.pathname +
            //     '?' +
            //     new URLSearchParams(state.query).toString(),
            // );
            state.currentSort = sort;
          }}
        >
          <TableHeader>
            {headers?.map(header => (
              <TableColumn allowsSorting key={header.column.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent={emptyContent}>
            {rows?.map(row => (
              // @ts-ignore
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
            ))}
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
