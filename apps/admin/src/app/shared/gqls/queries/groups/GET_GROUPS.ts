import { gql } from '@__generated__';

export const GET_GROUPS = gql(`
  #graphql
  query GetGroups(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    groups(
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
