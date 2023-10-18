'use client';

import { ModalContext } from '@contexts';
import { CoCModalProps, ModalProviderProps } from '@types';
import { observer, useLocalObservable } from 'mobx-react-lite';

export const ModalProvider = observer((props: ModalProviderProps) => {
  const modal = useLocalObservable<CoCModalProps>(() => {
    return {
      children: null,
      isOpen: false,
      header: null,
      content: null,
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
