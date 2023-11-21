import { gql } from '@__generated__';

export const UPDATE_SESSION = gql(`
  mutation UpdateSession($updateSessionInput: UpdateSessionInput!) {
    updateSession(updateSessionInput: $updateSessionInput) {
      id
    }
  }
`);
