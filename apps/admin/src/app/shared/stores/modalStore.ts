import { observable } from 'mobx';

export const modalStore = observable({
  SasModal: {
    isOpen: false,
    state: {},
    path: '',
  },
});
