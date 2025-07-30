import {
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { flexRender, Table as ReactTableProps } from "@tanstack/react-table";

export type TableProps<T> = {
  reactTable: ReactTableProps<T>;
};

export const Table = <T extends any>({
  reactTable,
  ...rest
}: TableProps<T>) => {
  const headers = reactTable?.getHeaderGroups?.()?.[0]?.headers || [];

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
        {reactTable.getRowModel().rows.map((row) => (
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
