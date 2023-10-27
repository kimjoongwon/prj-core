import { useContext } from 'react';
import { ServicesPageContext } from '../provider';

export const useServicesPage = () => {
  return useContext(ServicesPageContext);
};
