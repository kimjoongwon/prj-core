'use client';

import { Test } from './shared/components/test/Test';

// import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
// import { gql } from '../__generated__/gql';
// import { TextField } from '@kimjwally/ui';
// import { proxy, useSnapshot } from 'valtio';

// export const dynamic = 'force-dynamic';

// const GET_USERS = gql(/* GraphQL */ `
//   query Users {
//     users {
//       email
//       createdAt
//       profile {
//         phone
//       }
//     }
//   }
// `);

// const state = proxy({ count: 0, text: 'hello' });

export default function Page() {
  // const { data } = useSuspenseQuery(GET_USERS);
  // const snap = useSnapshot(state);

  return (
    <div>
      <Test />
      {/* {data?.users?.map((user, index) => (
        <div key={user.createdAt}>{user.email}</div>
      ))} */}
      {/* <TextField state={snap} path="text" /> */}
    </div>
  );
}
