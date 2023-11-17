import { gql } from '@__generated__';

export const UPDATE_SPACE = gql(`
  mutation UpdateSpace($updateSpaceInput: UpdateSpaceInput!) {
    updateSpace(updateSpaceInput: $updateSpaceInput) {
      id
    }
  }
`);
