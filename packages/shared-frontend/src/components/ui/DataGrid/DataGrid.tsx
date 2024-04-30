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
  GroupingState,
  Row,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { v4 } from 'uuid';
import { useLocalObservable } from 'mobx-react-lite';
import { action, toJS } from 'mobx';
import React from 'react';

export interface DataGridProps<T> {
  selectionMode: TableProps['selectionMode'];
  data: any[];
  columns: any[];
  onSortChange?: (sort: { key: string; value: 'asc' | 'desc' }) => void;
  onSelectionChange?: (selectedRowIds: string[]) => void;
}

export function DataGrid<T extends any>(props: DataGridProps<T>) {
  const {
    selectionMode,
    data,
    columns,
    onSortChange,
    onSelectionChange,
    ...rest
  } = props;

  const [grouping, setGrouping] = React.useState<GroupingState>([]);

  const table = useReactTable({
    data: data as T[],
    columns,
    state: {
      grouping,
    },
    getExpandedRowModel: getExpandedRowModel(),
    onGroupingChange: setGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  const rows = table.getRowModel().rows as Row<T & { id: string }>[];
  const headers = table.getLeafHeaders();

  const state: { sortDescriptor: SortDescriptor; selectedRowIds: string[] } =
    useLocalObservable(() => ({
      selectedRowIds: [],
      sortDescriptor: {
        column: undefined,
        direction: 'ascending',
      },
    }));

  const _onSortChange: TableProps['onSortChange'] = action(sortDescriptor => {
    state.sortDescriptor = sortDescriptor;
    onSortChange &&
      onSortChange({
        key: (sortDescriptor.column as string).split('_').join('.'),
        value: sortDescriptor.direction === 'ascending' ? 'asc' : 'desc',
      });
  });

  const _onSelectionChange = action((keys: Selection) => {
    if (keys instanceof Set) {
      state.selectedRowIds = Array.from(keys) as string[];
    }
    if (keys === 'all') {
      state.selectedRowIds = rows.map(row => row.original.id);
    }
    onSelectionChange && onSelectionChange(toJS(state.selectedRowIds));
  });

  return (
    <Table
      {...rest}
      align="center"
      selectionMode={selectionMode}
      onSelectionChange={_onSelectionChange}
      selectedKeys={state.selectedRowIds}
      sortDescriptor={state.sortDescriptor}
      onSortChange={_onSortChange}
    >
      <TableHeader>
        {headers?.map(header => (
          <TableColumn key={header.column.id} allowsSorting={!!onSortChange}>
            {header.isPlaceholder ? null : (
              <div>
                {header.column.getCanGroup() ? (
                  <button
                    {...{
                      onClick: header.column.getToggleGroupingHandler(),
                      style: {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {header.column.getIsGrouped()
                      ? `🛑(${header.column.getGroupedIndex()}) `
                      : `👊 `}
                  </button>
                ) : null}{' '}
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            )}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={rows?.length === 0 ? '데이터가 없습니다.' : undefined}
      >
        {rows?.map(row => (
          <TableRow key={row.original.id}>
            {row?.getVisibleCells()?.map(cell => (
              <TableCell key={v4()}>
                {cell.getIsGrouped() ? (
                  <>
                    <button
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: {
                          cursor: row.getCanExpand() ? 'pointer' : 'normal',
                        },
                      }}
                    >
                      {row.getIsExpanded() ? '👇' : '👉'}{' '}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}{' '}
                      ({row.subRows.length})
                    </button>
                  </>
                ) : cell.getIsAggregated() ? (
                  flexRender(
                    cell.column.columnDef.aggregatedCell ??
                      cell.column.columnDef.cell,
                    cell.getContext(),
                  )
                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
