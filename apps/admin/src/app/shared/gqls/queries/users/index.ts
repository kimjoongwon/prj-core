import { gql } from '__generated__'

export const GET_USERS = gql(`#graphql
  query GetUsers ($skip: Int, $take: Int) {
    users(skip: $skip, take: $take ) {
      nodes {
        email
        profile {
          nickname
          phone
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`)
