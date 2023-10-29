---
to: src/app/shared/gqls/queries/<%= name %>s/GET_<%= h.inflection.pluralize(name).toUpperCase() %>.ts
---
import { gql } from '@__generated__';

export const GET_<%= h.inflection.pluralize(name).toUpperCase() %> = gql(`
  #graphql
  query Get<%= Name %>s(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    <%= name %>s(
      skip: $skip
      take: $take
      sortingKey: $sortingKey
      sortingValue: $sortingValue
    ) {
      nodes {
        id
        createdAt
        name
      }
      pageInfo {
        totalCount
      }
    }
  }
`);
