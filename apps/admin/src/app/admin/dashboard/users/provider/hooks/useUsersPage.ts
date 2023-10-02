import { useContext } from 'react';
import { UsersPageContext } from '..';

export const useUsersPage = () => {
  return useContext(UsersPageContext);
};
