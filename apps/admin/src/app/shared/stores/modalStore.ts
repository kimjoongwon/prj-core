import { observable } from 'mobx';

export const modalStore = observable({
  testModal: {
    isOpen: false,
  },
  SelectModal: {
    isOpen: false,
    state: {},
    path: '',
    component: null as any,
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
