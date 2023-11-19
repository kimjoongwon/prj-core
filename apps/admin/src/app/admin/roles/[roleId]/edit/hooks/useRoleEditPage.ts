import { useContext } from 'react';
import { RoleEditPageContext } from '../provider';

export const useRoleEditPage = () => {
  return useContext(RoleEditPageContext);
};


