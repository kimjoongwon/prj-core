'use client';
import {
  CreateServiceDto,
  FormLayout,
  ServiceForm,
  UpdateServiceDto,
} from '@shared/frontend';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { usePage } from '../../_hooks';

const defaultFormObject: CreateServiceDto = {
  label: '',
  name: 'USER',
};

export const state = observable<{
  form: CreateServiceDto | UpdateServiceDto;
}>({
  form: defaultFormObject,
});

const ServiceEditPage = () => {
  const {
    meta: { rightButtons },
  } = usePage();

  return (
    <FormLayout title={'서비스 생성'} leftButtons={rightButtons}>
      <ServiceForm state={state.form} />
    </FormLayout>
  );
};

export default observer(ServiceEditPage);
