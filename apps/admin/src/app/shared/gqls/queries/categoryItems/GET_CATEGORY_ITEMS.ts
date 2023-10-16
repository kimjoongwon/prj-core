import { gql } from '@__generated__';

export const GET_CATEGORY_ITEMS = gql(`
  #graphql
  query GetCategoryItems(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    categoryItems(
      skip: $skip
      take: $take
      sortingKey: $sortingKey
      sortingValue: $sortingValue
    ) {
      nodes {
        name
      }
      pageInfo {
        endCursor
        totalCount
      }
    }
  }
`);
