import { gql } from '@__generated__';

export const GET_SPACE = gql(`
  query GetSpace($id: String!){
    space(id: $id) {
      id
    }
  }
`);
