import { useContext } from 'react';
import { WorkspacesPageContext } from '../provider';

export const useWorkspacesPage = () => {
  return useContext(WorkspacesPageContext);
};
