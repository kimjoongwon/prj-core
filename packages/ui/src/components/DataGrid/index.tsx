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

interface DataGridProps<T> extends Omit<TableProps, 'onSelectionChange'> {
  headers: Header<T, any>[];
  rows: Row<T & { id: string }>[];
  onSortChange?: TableProps['onSortChange'];
  onSelectionChange?: (selectedRowIds: Key[]) => void;
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { rows, headers, onSortChange, onSelectionChange, ...rest } = props;
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
    onSortChange && onSortChange(sortDescriptor);
  });

  const _onSelectionChange = action((keys: Selection) => {
    if (keys instanceof Set) {
      state.selectedRowIds = [...keys];
    }
    if (keys === 'all') {
      state.selectedRowIds = rows.map(row => row.original.id);
    }
    onSelectionChange && onSelectionChange(state.selectedRowIds);
  });

  return (
    <Table
      {...rest}
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
          <TableRow key={row.original.id}>
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
