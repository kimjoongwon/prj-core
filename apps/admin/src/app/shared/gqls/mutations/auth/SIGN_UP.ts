import { gql } from "@apollo/client";

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
