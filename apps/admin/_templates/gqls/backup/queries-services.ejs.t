---
to: src/app/shared/gqls/queries/<%= name %>s/GET_<%= h.inflection.pluralize(name).toUpperCase() %>.ts
---

import { gql } from '@__generated__';

export const CREATE_CATEGORY = gql(`
  #graphql
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      id
    }
  }
`);


