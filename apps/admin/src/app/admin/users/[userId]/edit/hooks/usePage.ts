import { useContext } from 'react';
import { PageContext } from '../provider';

export const useUsersPage = () => {
  return useContext(PageContext);
};
