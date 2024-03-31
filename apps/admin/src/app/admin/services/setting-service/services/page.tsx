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
  useGetServiceForm,
} from '@shared/frontend';
import { observable, toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';

const ServicesPage = observer(() => {
  const { data: serviceForm, isLoading } = useGetServiceForm();
  const serviceFormData = serviceForm?.data;
  const state = observable({ ...serviceFormData }!);

  // const state = observable(serviceFormData);

  console.log('render?')
  // console.log('serviceForm', serviceForm);

  return (
    <Container className="max-w-screen-2xl">
      <Select options={toJS(state.nameOptions)} state={state} path="name" />
    </Container>
  );
});

export default ServicesPage;
