import { gql } from '@__generated__';

export const GET_SESSION = gql(`
  query GetSession($id: String!){
    session(id: $id) {
      id
    }
  }
`);
