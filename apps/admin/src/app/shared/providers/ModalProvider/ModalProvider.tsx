'use client';

import { ModalContext } from '@contexts';
import { observer, useLocalObservable } from 'mobx-react-lite';

export interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = observer((props: ModalProviderProps) => {
  const modal = useLocalObservable(() => {
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
      buttons: [
        {
          children: 'Close',
          onClick: function () {
            modal.close();
          },
        },
      ],
    };
  });

  return (
    <ModalContext.Provider value={modal}>
      {props.children}
    </ModalContext.Provider>
  );
});
