import { gql } from '@__generated__';

export const GET_WORKSPACE = gql(`
  query GetWorkspace($id: String!){
    workspace(id: $id) {
      id
    }
  }
`);
