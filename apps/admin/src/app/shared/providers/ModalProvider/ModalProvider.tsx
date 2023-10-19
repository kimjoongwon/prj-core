'use client';

import { ModalContext } from '@contexts';
import { CoCModalProps, ModalProviderProps } from '@types';
import { observer, useLocalObservable } from 'mobx-react-lite';

export const ModalProvider = observer((props: ModalProviderProps) => {
  const modal = useLocalObservable<CoCModalProps>(() => {
    return {
      isOpen: false,
      header: null,
      content: 'CategoryItemEditModal',
      footer: null,
      open: function () {
        this.isOpen = true;
      },
      close: function () {
        this.isOpen = false;
      },
    };
  });

  return (
    <ModalContext.Provider value={modal}>
      {props.children}
    </ModalContext.Provider>
  );
});
