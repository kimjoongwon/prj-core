'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '__generated__/gql';

export const dynamic = 'force-dynamic';

const GET_USERS = gql(/* GraphQL */ `
  query Users {
    users {
      email
      createdAt
      profile {
        phone
      }
    }
  }
`);

export function Test() {
  const { data } = useSuspenseQuery(GET_USERS);

  return (
    <div>
      {data?.users?.map((user, index) => (
        <div key={user.createdAt}>{user.email}</div>
      ))}
    </div>
  );
}
