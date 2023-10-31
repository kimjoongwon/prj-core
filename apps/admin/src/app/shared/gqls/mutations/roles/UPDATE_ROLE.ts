import { gql } from '@__generated__';

export const UPDATE_ROLE = gql(`
  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {
    updateRole(updateRoleInput: $updateRoleInput) {
      id
    }
  }
`);
