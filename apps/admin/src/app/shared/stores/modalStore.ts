import { observable } from 'mobx';

export const modalStore = observable({
  SasModal: {
    isOpen: false,
    state: {},
    path: '',
    options: [
      {
        text: 'test',
        value: 'test',
      },
      {
        text: 'test2',
        value: 'test2',
      },
    ],
  },
});
