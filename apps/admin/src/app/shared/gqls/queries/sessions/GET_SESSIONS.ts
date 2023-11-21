import { gql } from '@__generated__';

export const GET_SESSIONS = gql(`
  #graphql
  query GetSessions(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    sessions(
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
