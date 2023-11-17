import { gql } from '@__generated__';

export const CREATE_SPACE = gql(`
  mutation CreateSpace($createSpaceInput: CreateSpaceInput!) {
    createSpace(createSpaceInput: $createSpaceInput) {
      name
    }
  }
`);

