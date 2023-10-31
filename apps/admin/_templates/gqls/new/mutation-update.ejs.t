---
to: src/app/shared/gqls/mutations/<%= name %>s/UPDATE_<%= h.inflection.singularize(name).toUpperCase() %>.ts
---

import { gql } from '@__generated__';

export const UPDATE_<%= h.inflection.singularize(name).toUpperCase() %> = gql(`
  mutation Update<%= Name %>($update<%= Name %>Input: Update<%= Name %>Input!) {
    update<%= Name %>(update<%= Name %>Input: $update<%= Name %>Input) {
      id
    }
  }
`);
