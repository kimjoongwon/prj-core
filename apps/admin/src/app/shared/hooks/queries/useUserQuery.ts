import { gql } from '@__generated__';
import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

export const GET_USER = gql(`#graphql
   query GetUser($id: String!) {
    user(id: $id) {
     email
     profile {
      nickname
      phone
     }
    }
   }
`);

export const useUserQuery = (id: string) => {
  return useSuspenseQuery(
    GET_USER,
    id === 'new'
      ? skipToken
      : {
          variables: { id },
        },
  );
};
