import { TableActions } from '@components';
import { ButtonProps } from '@nextui-org/react';
import { CellContext, createColumnHelper } from '@tanstack/react-table';

interface RowOnClick<T> {
  onClick: (cellContext: CellContext<T, any>) => void;
}

interface ColumnButton<T> extends Omit<ButtonProps, 'onClick'> {
  onClick: (cellContext: CellContext<T, any>) => void;
}

export interface ColumnMeta<T> {
  buttons: ColumnButton<T>[];
}

interface useActionColumnsParams<T> {
  meta: ColumnMeta<T>;
}

export const useActionColumns = <T extends object>(
  params: useActionColumnsParams<T>,
) => {
  const { meta } = params;

  const columnHelper = createColumnHelper<T>();

  const columns = [
    columnHelper.display({
      header: 'Action',
      cell: TableActions,
      meta,
    }),
  ];

  return columns;
};
