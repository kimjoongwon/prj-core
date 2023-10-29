---
to: src/app/shared/gqls/queries/<%= name %>s/GET_<%= h.inflection.singularize(name).toUpperCase() %>.ts
---

import { gql } from '@__generated__';

export const GET_<%= h.inflection.singularize(name).toUpperCase() %> = gql(`
  query Get<%= Name %>($id: String!){
    <%= name %>(id: $id) {
      id
    }
  }
`);
