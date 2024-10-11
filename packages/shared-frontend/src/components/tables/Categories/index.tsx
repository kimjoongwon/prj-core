'use client';

import React from 'react';
import { CategoryDto } from '../../../model';
import { CustomDataGridProps, DataGrid, Pagination, Spacer } from '../../ui';
import { observer } from 'mobx-react-lite';
import { useCategoriesTable } from './hooks/useCategoriesTable';

export interface CategoriesTableProps extends CustomDataGridProps {
  categories: CategoryDto[];
}

export const CategoriesTable = observer((props: CategoriesTableProps) => {
  const { categories, totalCount, ...rest } = props;
  const { state, columns, leftButtons, rightButtons } = useCategoriesTable({
    props,
  });

  return (
    <DataGrid
      {...rest}
      columns={columns}
      data={categories}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      state={state}
    />
  );
});
