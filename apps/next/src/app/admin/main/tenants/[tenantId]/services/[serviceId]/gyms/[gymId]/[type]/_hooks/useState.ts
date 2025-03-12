import { CreateGymDto } from '@shared/frontend';
import { State } from '@shared/types';
import { observable } from 'mobx';

export const createGymDto: CreateGymDto = {
  address: '',
  phone: '',
  email: '',
  businessNumber: '',
  depotId: '',
  space: {
    name: '',
    label: '',
  },
  categoryId: ''
};

export const useState = () => {
  return observable<State<CreateGymDto>>({
    form: {
      inputs: createGymDto,
    },
  });
};
