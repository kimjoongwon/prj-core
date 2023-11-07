---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/hooks/useQueries.ts
---
import { use<%= Name %>sQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    <%= name %>sQuery: use<%= Name %>sQuery(state.query),
  };
};
