import { gql } from '@__generated__';

export const GET_USERS = gql(`
  query GetUsers($skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {
    users(skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {
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
`);
