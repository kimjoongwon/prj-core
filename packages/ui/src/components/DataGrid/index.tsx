'use client';

import { observer } from 'mobx-react-lite';
import { DataGridView } from './DataGridView';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface DataGridProps<T> {
  data: T[] | undefined | null;
  columns: any[];
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { data, columns } = props;

  const table = useReactTable({
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    columns,
  });

  const headers = table.getHeaderGroups()?.[0]?.headers || [];
  const rows = table.getRowModel()?.rows || [];

  return <DataGridView headers={headers} rows={rows} />;
});
