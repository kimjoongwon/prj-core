import { gql } from '@__generated__';

export const DELETE_CATEGORY_ITEM = gql(`
  #graphql
  mutation DeleteCategoryItem($id: String!) {
    deleteCategoryItem(id: $id) {
      id
      name
      deletedAt
    }
  }
`);
