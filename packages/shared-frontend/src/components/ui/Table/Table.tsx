import {
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

export type TableComponentProps<T> = {
  table: ReactTable<T>;
};

export const Table = <T extends object>({
  table,
  ...rest
}: TableComponentProps<T>) => {
  const headers = table?.getHeaderGroups?.()?.[0]?.headers || [];

  return (
    <HeroTable fullWidth {...rest}>
      <TableHeader>
        {headers.map((header) => (
          <TableColumn key={header.id} colSpan={header.colSpan}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </HeroTable>
  );
};
