import { gql } from '@__generated__';

export const GET_SERVICE_FORM = gql(`
  query GetServiceForm {
    serviceForm {
      name
    }
  }
`);
