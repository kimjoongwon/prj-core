---
to: src/app/shared/gqls/queries/<%= name %>s/GET_<%= h.inflection.singularize(name).toUpperCase() %>_FORM.ts
---

import { gql } from '@__generated__';

export const GET_<%= h.inflection.singularize(name).toUpperCase() %>_FORM = gql(`
  query Get<%= Name %>Form {
    <%= name %>Form {
      name
    }
  }
`);