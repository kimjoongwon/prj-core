import { gql } from '__generated__'

export const GET_USERS = gql(`
  query GetUsers ($skip: Int, $take: Int) {
    users(skip: $skip, take: $take ) {
      nodes {
        id
        email
        profile {
          id
          nickname
          phone
        }
      }
      ...PageInfo @nonreactive
    }
  }
`)
