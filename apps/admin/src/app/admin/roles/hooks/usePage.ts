import { useContext } from 'react';
import { RolesPageContext } from '../provider';

export const useRolesPage = () => {
  return useContext(RolesPageContext);
};
