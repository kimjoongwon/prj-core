import { gql } from '@__generated__';

export const UPDATE_CATEGORY_ITEM = gql(`
  #graphql
  mutation UpdateCategoryItem($updateCategoryItemInput: UpdateCategoryItemInput!) {
    updateCategoryItem(updateCategoryItemInput: $updateCategoryItemInput) {
      id
      name
      deletedAt
    }
  }
`);
