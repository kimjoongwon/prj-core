import { useContext } from 'react';
import { WorkspaceEditPageContext } from '../provider';

export const useWorkspaceEditPage = () => {
  return useContext(WorkspaceEditPageContext);
};


