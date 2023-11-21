---
to: src/app/shared/columns/use<%= Name %>Columns.ts
---

import { <%= Name %> } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const use<%= Name %>Columns = () => {
  const columnHelper = createColumnHelper<<%= Name %>>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
  ];
  return columns;
};
