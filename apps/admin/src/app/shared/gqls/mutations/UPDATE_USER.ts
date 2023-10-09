import { gql } from '@__generated__';

export const UPDATE_USER = gql(`#graphql
  mutation UpdateUser ($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput){
      email
    }
  }
`);
