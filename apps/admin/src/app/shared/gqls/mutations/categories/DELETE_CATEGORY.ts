import { gql } from '@__generated__';

export const DELETE_CATEGORY = gql(`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`);
