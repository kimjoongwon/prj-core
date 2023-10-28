import { gql } from '@__generated__';

export const GET_EMAILS = gql(`
  #graphql
  query GetEmail(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    email(
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
