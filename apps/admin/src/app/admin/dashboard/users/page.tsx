export const dynamic = 'force-dynamic';

import React from 'react';

import { Provider } from './components/Provider';
import { Users } from './components/Users';

export default function Page() {
  return (
    <Provider>
      <Users />
    </Provider>
  );
}
