import { observable } from 'mobx';
import { ReactNode } from 'react';

interface ModalStore {
  open: boolean;
  header: string | ReactNode;
  body: string | ReactNode;
  footer: string | ReactNode;
}

export const modalStore = observable<ModalStore>({
  open: false,
  header: null,
  body: null,
  footer: null,
});
