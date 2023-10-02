import { useContext } from 'react';
import { UsersPageContext } from '..';

export const usePage = () => {
  return useContext(UsersPageContext);
};
