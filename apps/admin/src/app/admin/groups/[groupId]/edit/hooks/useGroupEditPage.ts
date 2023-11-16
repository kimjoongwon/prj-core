import { useContext } from 'react';
import { GroupEditPageContext } from '../provider';

export const useGroupEditPage = () => {
  return useContext(GroupEditPageContext);
};


