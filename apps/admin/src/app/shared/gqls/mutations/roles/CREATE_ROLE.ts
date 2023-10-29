import { gql } from '@__generated__';

export const CREATE_ROLE = gql(`
  mutation CreateRole($createRoleInput: CreateRoleInput!) {
    createRole(createRoleInput: $createRoleInput) {
      name
    }
  }
`);

