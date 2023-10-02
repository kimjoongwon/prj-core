import { useContext } from 'react';
import { UserEditPageContext } from '..';

export const useUserEditPage = () => {
  return useContext(UserEditPageContext);
};
