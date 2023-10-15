import { gql } from '@__generated__';

export const GET_WORKSPACE = gql(`#graphql
  query GetWorkspace($id: String!) {
    workspace(id: $id) {
      name
    }
  }
`);
