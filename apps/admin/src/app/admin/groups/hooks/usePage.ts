import { useContext } from 'react';
import { GroupsPageContext } from '../provider';

export const useGroupsPage = () => {
  return useContext(GroupsPageContext);
};
