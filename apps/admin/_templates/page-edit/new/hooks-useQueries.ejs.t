---
to: src/app/admin/<%= h.inflection.pluralize(name) %>/[<%= name %>Id]/edit/hooks/useQueries.ts
---

import { use<%= Name %>FormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const <%= name %>FormQuery = use<%= Name %>FormQuery({
    id: id as string,
  });

  return {
    <%= name %>FormQuery,
  };
};
