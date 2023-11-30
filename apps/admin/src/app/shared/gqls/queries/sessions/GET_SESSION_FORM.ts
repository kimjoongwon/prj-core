import { gql } from '@__generated__';

export const GET_SESSION_FORM = gql(`
  query GetSessionForm($id: String!) {
    sessionForm(id: $id) {
      name
      dates
      tenantId
    }
  }
`);
