'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { DataGrid } from '@shared/frontend';
import { useProps } from './_hooks/useProps';

const ServicesPage = observer(() => {
  const { state, data = [], columns, leftButtons, rightButtons } = useProps();
  console.log(state.selectedKeys)
  return (
    <DataGrid
      color={'primary'}
      selectionMode="multiple"
      selectedKey="id"
      data={data}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      state={state}
    />
  );
});

export default ServicesPage;
