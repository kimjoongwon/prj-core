import React, { useEffect } from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from '@heroui/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action, reaction } from 'mobx';
import { PageState } from '@shared/types';

export type Key = string | number;

export type DataGridState<T> = {
  currentSort?: SortDescriptor;
  selection?: Selection;
};

export interface DataGridProps<T> extends TableProps {
  state?: PageState['dataGrid'];
  data: T[];
  columns: ColumnDef<T, any>[];
  emptyContent?: string;
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
      state,
      emptyContent = '데이터가 없습니다.',
      selectionMode,
    } = props;

    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row: any) => row?.children || [],
      getExpandedRowModel: getExpandedRowModel(),
      onRowSelectionChange: setRowSelection,
      onExpandedChange: setExpanded,
      state: {
        rowSelection,
        expanded,
      },
      debugTable: false,
      debugHeaders: false,
      debugColumns: false,
    });

    const headers = table?.getHeaderGroups?.()?.[0]?.headers || [];

    const localState = useLocalObservable<{
      selection: Selection;
    }>(() => ({
      selection: new Set(state?.selectedRowIds || []),
    }));

    const onSelectionChange = action((selection: Selection) => {
      localState.selection = selection;
    });

    useEffect(() => {
      const disposer = reaction(
        () => localState.selection,
        () => {
          if (selectionMode === 'single') {
            state.selectedRowIds = Array.from(localState.selection).slice(-1);
            return;
          }
          if (localState.selection === 'all') {
            state.selectedRowIds = ['all'];
          } else {
            state.selectedRowIds = Array.from(localState.selection);
          }
        },
      );

      return disposer;
    }, []);

    return (
      <Table
        fullWidth
        selectionMode={selectionMode}
        aria-label="datagrid"
        isHeaderSticky
        isCompact
        selectedKeys={localState.selection}
        defaultSelectedKeys={localState.selection}
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          {headers.map(header => {
            return (
              <TableColumn key={header.column.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody emptyContent={emptyContent}>
          {table.getRowModel().rows.map(row => {
            return (
              <TableRow key={row.original.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  },
);
