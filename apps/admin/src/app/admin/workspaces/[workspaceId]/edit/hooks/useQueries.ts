import { useWorkspaceFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { workspaceId = 'new' } = useParams();
  console.log('id', workspaceId);
  const workspaceFormQuery = useWorkspaceFormQuery({
    id: workspaceId as string,
  });

  console.log('workspaceFormQuery', workspaceFormQuery);

  return {
    workspaceFormQuery,
  };
};
