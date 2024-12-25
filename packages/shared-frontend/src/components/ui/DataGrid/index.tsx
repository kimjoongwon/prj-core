import React from 'react';
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
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

export type Key = string | number;

export type DataGridState<T> = {
  currentSort?: SortDescriptor;
  selection?: Selection;
};

export interface DataGridProps<T> extends TableProps {
  state?: DataGridState<T>;
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

    const onSelectionChange = action((selection: Selection) => {
      state.selection = selection;
    });

    return (
      <Table
        fullWidth
        aria-label="datagrid"
        isHeaderSticky
        isCompact
        defaultSelectedKeys={state?.selection}
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
              <TableRow key={row.id}>
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
