import { useContext } from 'react';
import { ServiceEditPageContext } from '../provider';

export const useServiceEditPage = () => {
  return useContext(ServiceEditPageContext);
};
