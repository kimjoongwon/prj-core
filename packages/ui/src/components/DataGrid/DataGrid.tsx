'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ButtonProps,
} from '@nextui-org/react';
import {
  ColumnDef,
  Table as ReactTable,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { v4 } from 'uuid';
import { DataGridButtons } from './Buttons/DataGridButtons';

export interface DataGridButton<T> {
  text: string;
  onClick: (table: ReactTable<T>) => void;
  element?: React.ReactNode;
  props?: ButtonProps;
  href?: string;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<any, any>[];
  // 버튼은 생성과 수정을 담당합니다. 수정은 상태변경을 포함합니다. 삭제도 있네요..
  rightButtons?: DataGridButton<any>[];
  leftButtons?: DataGridButton<any>[];
  // inputs의 경우 테이블 리스트 출력을 위한 결과값을 입력하는 요소들입니다.
  inputs?: React.ReactNode;
}

function _DataGrid<T extends object | null | undefined>(
  props: DataGridProps<T>,
) {
  const { data, columns, leftButtons, rightButtons } = props;
  const [columnPinning, setColumnPinning] = React.useState({});

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    columns,
    state: {
      columnPinning,
    },
    onColumnPinningChange: setColumnPinning,
  });

  const headers = table.getHeaderGroups()?.[0]?.headers || [];
  const rows = table.getRowModel()?.rows || [];

  return (
    <>
      <div className="flex flex-row justify-between">
        <DataGridButtons buttons={leftButtons} table={table} />
        <DataGridButtons buttons={rightButtons} table={table} />
      </div>
      <Table>
        <TableHeader>
          {headers?.map(header => (
            <TableColumn key={v4()}>
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
    </>
  );
}

export const DataGrid = _DataGrid;
