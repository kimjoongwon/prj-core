import { gql } from '@__generated__';

export const GET_WORKSPACES = gql(`
  #graphql
  query GetWorkspaces(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    workspaces(
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
