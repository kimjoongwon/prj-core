import { gql } from '@__generated__';

export const UPDATE_GROUP = gql(`
  mutation UpdateGroup($updateGroupInput: UpdateGroupInput!) {
    updateGroup(updateGroupInput: $updateGroupInput) {
      id
    }
  }
`);
