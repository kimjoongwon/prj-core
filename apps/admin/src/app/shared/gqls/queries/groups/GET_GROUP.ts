import { gql } from '@__generated__';

export const GET_GROUP = gql(`
  query GetGroup($id: String!){
    group(id: $id) {
      id
    }
  }
`);
