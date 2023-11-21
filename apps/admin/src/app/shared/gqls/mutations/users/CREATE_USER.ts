import { gql } from '@__generated__';

export const CREATE_USER = gql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      name
      email
    }
  }
`);
