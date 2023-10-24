import { gql } from '@__generated__';

export const GET_CATEGORY_ITEM_FORM = gql(`
  #graphql
  query GetCategoryItemForm($id: String!) {
    categoryItem(id: $id) {
      id
      name
      parentId
    }
  }
`);
