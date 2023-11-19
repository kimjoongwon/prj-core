import { useRoleFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { roleId = 'new' } = useParams();
  const roleFormQuery = useRoleFormQuery({
    id: roleId as string,
  });

  return {
    roleFormQuery,
  };
};
