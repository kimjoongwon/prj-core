import { Workspace } from '@__generated__/graphql';
import { useQueries } from './useQueries';
import { useCoCTable } from '@hooks';
import { useWorkspaceColumns } from '@columns';


export const useTable = ({ userQuery }: ReturnType<typeof useQueries>) => {
  const table = useCoCTable<Workspace>({
    data: userQuery.data?.workspaces?.nodes || [],
    columns: useWorkspaceColumns(),
  });

  return table;
};
