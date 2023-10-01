import { gql } from '@__generated__';
import { GetUsersQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

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

export const useUsersQuery = (
  getUsersQueryVariables: GetUsersQueryVariables,
) => {
  return useSuspenseQuery(GET_USERS, {
    variables: getUsersQueryVariables,
    fetchPolicy: 'cache-and-network',
  });
};
