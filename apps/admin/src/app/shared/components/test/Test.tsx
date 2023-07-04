'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { TextField } from '@kimjwally/ui';
import { gql } from '__generated__/gql';
import { proxy, useSnapshot } from 'valtio';

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

const state = proxy({ count: 0, text: 'hello' });

export function Test() {
  const { data } = useSuspenseQuery(GET_USERS);
  const snap = useSnapshot(state);

  return (
    <div>
      {data?.users?.map((user, index) => (
        <div key={user.createdAt}>{user.email}</div>
      ))}
      <TextField state={snap} path="text" />
    </div>
  );
}
