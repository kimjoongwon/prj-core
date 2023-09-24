'use client';

import { observer } from 'mobx-react-lite';
import { DataGridView } from './DataGridView';
import { Table } from '@tanstack/react-table';

interface DataGridProps<T> {
  table: Table<any>;
  data: T[] | undefined | null;
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { table } = props;

  const headers = table.getHeaderGroups()?.[0]?.headers || [];
  const rows = table.getRowModel()?.rows || [];

  return <DataGridView headers={headers} rows={rows} />;
});
