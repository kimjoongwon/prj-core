import { gql } from '@__generated__';

export const GET_SPACES = gql(`
  #graphql
  query GetSpaces(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    spaces(
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
