import { gql } from '@__generated__';

export const DELETE_CATEGORY = gql(`
  mutation deleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`);
