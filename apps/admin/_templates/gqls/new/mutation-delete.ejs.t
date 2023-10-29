---
to: src/app/shared/gqls/mutations/<%= name %>s/DELETE_<%= h.inflection.singularize(name).toUpperCase() %>.ts
---

import { gql } from '@__generated__';

export const DELETE_<%= h.inflection.singularize(name).toUpperCase() %> = gql(`
  mutation Delete<%= Name %>($id: String!) {
    delete<%= Name %>(id: $id) {
      id
    }
  }
`);
