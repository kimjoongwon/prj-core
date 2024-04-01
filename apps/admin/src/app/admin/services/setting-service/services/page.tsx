'use client';

import {
  Button,
  Container,
  CreateServiceDto,
  DataGrid,
  FormControl,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
  useGetCreateServiceDtoSchema,
  useGetServiceForm,
} from '@shared/frontend';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

const ServicesPage = observer(() => {
  const { data: serviceForm } = useGetServiceForm();
  const { data: createServiceDtoSchema } = useGetCreateServiceDtoSchema();

  const serviceFormData = serviceForm?.data;
  const state = observable({ ...serviceFormData }!);

  return (
    <Container className="max-w-screen-2xl">
      <HStack>
        <FormControl schema={createServiceDtoSchema} timings={['onBlur']}>
          <Select options={toJS(state.nameOptions)} state={state} path="name" />
        </FormControl>
      </HStack>
    </Container>
  );
});

export default ServicesPage;
