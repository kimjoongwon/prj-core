import { Workspace } from '@__generated__/graphql';
import { useQueries } from './useQueries';
import { useCoCTable } from '@hooks';
import { useWorkspaceColumns } from '@columns';

export const useTable = ({
  workspacesQuery,
}: ReturnType<typeof useQueries>) => {
  const table = useCoCTable<Workspace>({
    data: workspacesQuery.data?.workspaces?.nodes || [],
    columns: useWorkspaceColumns(),
  });

  return table;
};
