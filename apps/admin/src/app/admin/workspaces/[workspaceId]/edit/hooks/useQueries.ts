import { useWorkspaceFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const workspaceFormQuery = useWorkspaceFormQuery({
    id: id as string,
  });

  return {
    workspaceFormQuery,
  };
};
