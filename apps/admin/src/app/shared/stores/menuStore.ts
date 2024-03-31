import { observable } from 'mobx';

export const contextStore = observable({
  service: {
    name: '',
  },
});
