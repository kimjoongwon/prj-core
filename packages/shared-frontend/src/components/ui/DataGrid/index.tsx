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
  TableProps,
  TableRow,
} from '@nextui-org/react';
import { TableContainer } from './TableContainer';
import { HStack } from '../HStack';
import { observer } from 'mobx-react-lite';
import { difference, uniq } from 'lodash-es';

export type DataGridState = {
  selectedKeys: string[];
};

export interface DataGridProps<T> extends TableProps {
  state?: DataGridState;
  data: T[];
  columns: ColumnDef<T, any>[];
  leftButtons?: ButtonProps[];
  rightButtons?: ButtonProps[];
  actions?: ('삭제' | '생성' | '제거')[];
  selectedKey?: keyof T;
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
      columns,
      leftButtons,
      rightButtons,
      selectedKey = 'id',
      state,
      ...rest
    } = props;

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
              state.selectedKeys = uniq([state.selectedKeys, ...allKey]);
            } else {
              difference(state?.selectedKeys || [], Array.from(selection));
            }
          }}
        >
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
              // @ts-ignore
              <TableRow key={row.original?.[selectedKey as string]}>
                {row.getAllCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);
