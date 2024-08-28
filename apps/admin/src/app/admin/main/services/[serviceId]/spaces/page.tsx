'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Container, DataGrid } from '@shared/frontend';
import { useProps } from './_hooks/useProps';
import { createPost } from './invalidate';

const ServicesPage = observer(() => {
  const { state, data = [], columns, leftButtons, rightButtons } = useProps();

  return (
    <Container className="max-w-screen-xl">
      <Button formAction={createPost}>test</Button>
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
    </Container>
  );
});

export default ServicesPage;
