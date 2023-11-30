import { gql } from '@__generated__';

export const GET_TIMELINES = gql(`
  #graphql
  query GetTimelines(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    timelines(
      skip: $skip
      take: $take
      sortingKey: $sortingKey
      sortingValue: $sortingValue
    ) {
      nodes {
        id
        date
        createdAt
      }
      pageInfo {
        totalCount
      }
    }
  }
`);
