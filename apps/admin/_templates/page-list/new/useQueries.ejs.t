---
to: src/app/admin/dashboard/<%= name %>/provider/hooks/useQueries.ts
---

import { use<%= Name %>Query } from '@hooks';
import { useState } from './useState';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const <%= name %>Query = use<%= Name %>Query({
    skip: state.table.pagination.skip,
    take: state.table.pagination.take,
  });

  return {
    <%= name %>Query,
  };
};
