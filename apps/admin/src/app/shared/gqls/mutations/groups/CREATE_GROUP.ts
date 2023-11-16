import { gql } from '@__generated__';

export const CREATE_GROUP = gql(`
  mutation CreateGroup($createGroupInput: CreateGroupInput!) {
    createGroup(createGroupInput: $createGroupInput) {
      name
    }
  }
`);

