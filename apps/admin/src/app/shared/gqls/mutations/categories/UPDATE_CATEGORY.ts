import { gql } from '@__generated__';

export const UPDATE_CATEGORY = gql(`
  mutation updateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      id
    }
  }
`);
