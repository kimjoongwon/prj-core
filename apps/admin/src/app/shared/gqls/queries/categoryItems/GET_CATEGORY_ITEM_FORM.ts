import { gql } from '@__generated__';

export const GET_CATEGORY_ITEM_FORM = gql(`
  #graphql
  query GetCategoryItemForm {
    categoryItemForm {
      name
      parentId
    }
  }
`);
