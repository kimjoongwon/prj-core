import { gql } from '@__generated__';

export const GET_CATEGORIES = gql(`#graphql
  query GetCategories($take: Int, $skip: Int) {
    categories (take: $take, skip: $skip) {
      nodes {
        id 
        name
      }
      pageInfo {
        endCursor 
        totalCount
      }
    }
  }
`);
