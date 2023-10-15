import { gql } from '@__generated__';

export const GET_USERS = gql(`#graphql
  query GetUsers($email: String, $skip: Int, $take: Int, $sortingKey: String, $sortingValue: String) {
    users(email: $email, skip: $skip, take: $take, sortingKey: $sortingKey, sortingValue: $sortingValue) {
      nodes {
        id
        id
        email
        profile {
          id
          nickname
          phone
        }
      }
      pageInfo {
        endCursor
        totalCount
      }
    }
  }
`);
