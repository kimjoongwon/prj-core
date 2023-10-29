import { gql } from '@__generated__';

export const GET_ROLE_FORM = gql(`
  query GetRoleForm {
    roleForm {
      name
    }
  }
`);