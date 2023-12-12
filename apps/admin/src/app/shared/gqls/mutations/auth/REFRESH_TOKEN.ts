import { gql } from '@__generated__';

export const REFRESH_TOKEN = gql(`
  #graphql
  mutation RefreshToken {
    refreshToken {
      accessToken
      refreshToken
      user {
        id
        email
        name
        tenants {
          id
        }
      }
    }
  }
`);
