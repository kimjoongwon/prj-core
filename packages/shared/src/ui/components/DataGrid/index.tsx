'use client';

import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { DataGrid as BaseDataGrid, DataGridProps } from './DataGrid';
import { forwardRef } from 'react';
import Skeleton from '../Skeleton';

const DynamicDataGrid = dynamic(
  () => import('./DataGrid').then(mod => observer(forwardRef(mod.DataGrid))),
  {
    loading() {
      return <Skeleton className="h-32 w-full" />;
    },
    ssr: false,
  },
);

const DataGrid = DynamicDataGrid as <T extends object>(
  props: DataGridProps<T>,
) => ReturnType<typeof BaseDataGrid>;

export default DataGrid;
