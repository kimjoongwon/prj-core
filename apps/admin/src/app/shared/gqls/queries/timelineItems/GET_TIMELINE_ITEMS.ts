import { gql } from '@__generated__';

export const GET_TIMELINE_ITEMS = gql(`
  #graphql
  query GetTimelineItems(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    timelineItems(
      skip: $skip
      take: $take
      sortingKey: $sortingKey
      sortingValue: $sortingValue
    ) {
      nodes {
        id
        createdAt
        title
      }
      pageInfo {
        totalCount
      }
    }
  }
`);
