import { gql } from '@__generated__';

export const GET_ROLE = gql(`
  query GetRole($id: String!){
    role(id: $id) {
      id
    }
  }
`);
