import { gql } from '@__generated__';

export const GET_SERVICE_FORM = gql(`
  query GetServiceForm($id: String!) {
    serviceForm(id: $id) {
      id
      name
    }
  }
`);
