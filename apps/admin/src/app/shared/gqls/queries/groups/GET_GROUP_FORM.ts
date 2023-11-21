import { gql } from '@__generated__';

export const GET_GROUP_FORM = gql(`
  query GetGroupForm($id: String!) {
    groupForm(id: $id) {
      name
      tenantId
      serviceId
    }
  }
`);
