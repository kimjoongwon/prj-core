;

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
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';

interface DataGridProps<T> {
  selectionMode: TableProps['selectionMode'];
  data: any[];
  columns: any[];
  onSortChange?: (sort: { key: string; value: 'asc' | 'desc' }) => void;
  onSelectionChange?: (selectedRowIds: string[]) => void;
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const {
    selectionMode,
    data,
    columns,
    onSortChange,
    onSelectionChange,
    ...rest
  } = props;

  const table = useReactTable({
    data: data as T[],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    onSelectionChange && onSelectionChange(state.selectedRowIds);
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
            {header.isPlaceholder ? (
              <></>
            ) : (
              flexRender(header.column.columnDef.header, header.getContext())
            )}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={rows?.length === 0 ? '데이터가 없습니다.' : undefined}
      >
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
