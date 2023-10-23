import { gql } from '@__generated__';

export const DELETE_CATEGORIES = gql(`
  #graphql
  mutation DeleteCategories($ids: [String!]!) {
    deleteCategories(ids: $ids) {
      name
    }
  }
`);
