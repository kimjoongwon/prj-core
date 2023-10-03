import { gql } from '@__generated__'

export const SIGN_UP = gql(`#graphql
  mutation SignUp($signUpInput: SignupInput!) {
    signup(data: $signUpInput) {
      user {
        id
        email
      }
    }
  }
`)
