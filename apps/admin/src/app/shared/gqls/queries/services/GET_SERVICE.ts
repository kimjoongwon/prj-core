import { gql } from '@__generated__';

export const GET_SERVICE = gql(`
  query GetService($id: String!) {
    service(id: $id) {
      id
      name
    }
  }
`);
