import { gql } from '@__generated__';

export const REFRESH_TOKEN = gql(`
  #graphql
  mutation RefreshToken($token: JWT!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`);
