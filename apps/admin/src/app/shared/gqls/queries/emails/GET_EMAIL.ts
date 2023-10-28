import { gql } from '@__generated__';

export const GET_EMAILS_FORM = gql(`
  query GetEmailForm {
    emailForm {
      id
    }
  }
`);
