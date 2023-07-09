import { gql } from './gql'

export const GET_USERS = gql(`
  query Users {
    users {
      id
      createdAt
      profile {
        nickname
        phone
      }
    }
  }
`)
