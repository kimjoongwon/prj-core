'use client';

import { observer } from 'mobx-react-lite';
import { DataGridView } from './DataGridView';
import { Header, Row, Table } from '@tanstack/react-table';

interface DataGridProps<T> {
  headers: Header<T, any>[];
  rows: Row<T>[];
}

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { rows, headers } = props;

  return <DataGridView headers={headers} rows={rows} />;
});
