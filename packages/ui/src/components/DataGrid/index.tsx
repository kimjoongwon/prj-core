'use client';

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

import { Header, Row, flexRender } from '@tanstack/react-table';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import { Key } from 'react';

interface DataGridProps<T>
  extends Omit<TableProps, 'onSelectionChange' | 'onSortChange'> {
  headers: Header<T, any>[];
  rows: Row<T & { cuid: string }>[];
  onSortChange?: (sort: { key: string; value: 'asc' | 'desc' }) => void;
  onSelectionChange?: (selectedRowIds: Key[] | Key) => void;
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const {
    selectionMode,
    rows,
    headers,
    onSortChange,
    onSelectionChange,
    ...rest
  } = props;

  const state: { sortDescriptor: SortDescriptor; selectedRowIds: Key[] } =
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
      state.selectedRowIds = Array.from(keys);
    }
    if (keys === 'all') {
      state.selectedRowIds = rows.map(row => row.original.cuid);
    }
    if (selectionMode) {
      return onSelectionChange && onSelectionChange(state.selectedRowIds[0]);
    }
    onSelectionChange && onSelectionChange(state.selectedRowIds);
  });

  return (
    <Table
      {...rest}
      selectionMode={selectionMode}
      onSelectionChange={_onSelectionChange}
      selectedKeys={state.selectedRowIds}
      sortDescriptor={state.sortDescriptor}
      onSortChange={_onSortChange}
    >
      <TableHeader>
        {headers?.map(header => (
          <TableColumn key={header.column.id} allowsSorting={!!onSortChange}>
            {header.isPlaceholder ? (
              <></>
            ) : (
              flexRender(header.column.columnDef.header, header.getContext())
            )}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows?.map(row => (
          <TableRow key={row.original.cuid}>
            {row.getVisibleCells()?.map(cell => (
              <TableCell key={v4()}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
