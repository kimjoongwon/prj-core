---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/useTable.ts
---

import { <%= h.inflection.singularize(Name) %> } from '@__generated__/graphql';
import { useQueries } from './useQueries';
import { useCoCTable } from '@hooks';
import { use<%= h.inflection.singularize(Name) %>Columns } from '@columns';


export const useTable = ({ userQuery }: ReturnType<typeof useQueries>) => {
  const table = useCoCTable<<%= h.inflection.singularize(Name) %>>({
    data: userQuery.data?.<%= name %>?.nodes || [],
    columns: use<%= h.inflection.singularize(Name) %>Columns(),
  });

  return table;
};
