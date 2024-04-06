'use client';

import {
  Container,
  DataGrid,
  FormControl,
  HStack,
  Select,
  ServiceDto,
  useGetAllService,
  useGetServiceForm,
} from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

const ServicesPage = observer(() => {
  const { data: serviceForm, isLoading } = useGetServiceForm();
  const { data: getAllService } = useGetAllService();
  const services = getAllService?.data || [];

  const serviceFormData = serviceForm?.data;
  const { defaultObject, form, schema } = serviceFormData || {};
  const state = observable({ ...defaultObject });

  const columnHelper = createColumnHelper<ServiceDto>();
  const columns = [
    columnHelper.accessor('name', {
      header: '서비스 명',
    }),
  ];

  if (isLoading) {
    return null;
  }

  return (
    <Container className="max-w-screen-2xl">
      <HStack>
        <FormControl schema={schema} timings={['onBlur']}>
          <Select
            options={form?.nameOptions}
            state={state}
            path="name"
            value={state.name}
          />
        </FormControl>
      </HStack>
      <DataGrid selectionMode="multiple" data={services} columns={columns} />
    </Container>
  );
});

export default ServicesPage;
