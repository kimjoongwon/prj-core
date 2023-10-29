import { gql } from '@__generated__';

export const GET_ROLES = gql(`
  #graphql
  query GetRoles(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    roles(
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
