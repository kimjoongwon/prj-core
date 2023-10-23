import { gql } from '@__generated__';

export const REMOVE_CATEGORY = gql(`
  mutation RemoveCategory($id: String!) {
    removeCategory(id: $id) {
      id
    }
  }
`);
