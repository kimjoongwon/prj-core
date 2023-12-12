import { gql } from '@__generated__';

export const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        id
        name
        email
        createdAt
        tenants {
          id
          role {
            id
            name
          }
        }
      }
      accessToken
      refreshToken
    }
  }
`);
