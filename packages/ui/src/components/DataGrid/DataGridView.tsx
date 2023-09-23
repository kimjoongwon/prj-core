import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Header, Row, flexRender } from '@tanstack/react-table';
import { v4 } from 'uuid';

interface DataGridViewProps<T> {
  headers: Header<T, unknown>[];
  rows: Row<T>[];
}

export function DataGridView<T extends any>(props: DataGridViewProps<T>) {
  const { headers, rows } = props;

  return (
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
  );
}
