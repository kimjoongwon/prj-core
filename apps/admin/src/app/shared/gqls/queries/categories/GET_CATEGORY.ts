import { gql } from '@__generated__';

export const GET_CATEGORY = gql(`
  query GetCategory($id: String!) {
    category(id: $id) {
      id
      name
      itemId
    }
  }
`);
