'use client';

import React from 'react';
import { CategoryDto } from '../../../model';
import { DataGrid } from '../../ui';
import { useProps } from './hooks/useProps';
import { TableProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

interface ServicesTablsProps extends TableProps {
  categories: CategoryDto[];
}

export const CategoriesTable = observer((props: ServicesTablsProps) => {
  const { categories, ...rest } = props;
  const { state, columns, leftButtons, rightButtons } = useProps();

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
