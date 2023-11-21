import { gql } from '@__generated__';

export const CREATE_SESSION = gql(`
  mutation CreateSession($createSessionInput: CreateSessionInput!) {
    createSession(createSessionInput: $createSessionInput) {
      name
    }
  }
`);
