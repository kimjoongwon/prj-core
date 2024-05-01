import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';

export interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
}

export function DataGrid<T extends object>(props: DataGridProps<T>) {
  const { data, columns } = props;

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="border-1">
      <TableHead table={table} />
      <TableBody table={table} />
      <TableFooter table={table} />
    </table>
  );
}
