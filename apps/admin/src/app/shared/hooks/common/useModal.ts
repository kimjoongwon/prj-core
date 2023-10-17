import { ModalContext } from '@contexts';
import { useContext } from 'react';

export const useModal = () => {
  return useContext(ModalContext);
};
