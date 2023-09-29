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
} from '@nextui-org/react';

import { Header, Row, flexRender } from '@tanstack/react-table';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';

interface DataGridProps<T> {
  headers: Header<T, any>[];
  rows: Row<T>[];
  onSortChange?: TableProps['onSortChange'];
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { rows, headers, onSortChange } = props;
  const state: { sortDescriptor: SortDescriptor } = useLocalObservable(() => ({
    sortDescriptor: {
      column: undefined,
      direction: 'ascending',
    },
  }));

  const _onSortChange: TableProps['onSortChange'] = action(sortDescriptor => {
    state.sortDescriptor = sortDescriptor;
    onSortChange && onSortChange(sortDescriptor);
  });

  return (
    <Table sortDescriptor={state.sortDescriptor} onSortChange={_onSortChange}>
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
          <TableRow key={v4()}>
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
