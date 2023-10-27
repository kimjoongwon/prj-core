import { gql } from '@__generated__';

export const DELETE_SERVICE = gql(`
  mutation DeleteService($id: String!) {
    deleteService(id: $id) {
      id
    }
  }
`);
