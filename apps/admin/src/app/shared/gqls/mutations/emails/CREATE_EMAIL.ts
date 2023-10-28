import { gql } from '@__generated__';

export const CREATE_EMAIL = gql(`
  mutation CreateEmail($createEmailInput: CreateEmailInput!) {
    createEmail(createEmailInput: $createEmailInput) {
      id
    }
  }
`);

