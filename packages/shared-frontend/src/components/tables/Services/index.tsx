'use client';

import React from 'react';
import { ServiceDto } from '../../../model';
import { DataGrid } from '../../ui';
import { useProps } from './hooks/useProps';
import { TableProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

interface ServicesTablsProps extends TableProps {
  services: ServiceDto[];
}

export const ServicesTable = observer((props: ServicesTablsProps) => {
  const { services, ...rest } = props;
  const { state, columns, leftButtons, rightButtons } = useProps();

  return (
    <DataGrid
      {...rest}
      columns={columns}
      data={services}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      state={state}
    />
  );
});
