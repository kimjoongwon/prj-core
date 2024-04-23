import { observable } from 'mobx';

export const modalStore = observable({
  open: false,
  header: null,
  body: null,
  footer: null,
});
