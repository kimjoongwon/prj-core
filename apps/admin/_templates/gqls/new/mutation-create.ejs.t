---
to: src/app/shared/gqls/mutations/<%= name %>s/CREATE_<%= h.inflection.singularize(name).toUpperCase() %>.ts
---

import { gql } from '@__generated__';

export const CREATE_<%= h.inflection.singularize(name).toUpperCase() %> = gql(`
  mutation Create<%= Name %>($create<%= Name %>Input: Create<%= Name %>Input!) {
    create<%= Name %>(create<%= Name %>Input: $create<%= Name %>Input) {
      name
    }
  }
`);

