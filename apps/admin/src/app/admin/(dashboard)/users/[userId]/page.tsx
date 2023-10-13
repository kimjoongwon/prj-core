'use client';

import { Provider } from './components/Provider';
import { User } from './components/User';

export default function Page() {
  return (
    <Provider>
      <User />
    </Provider>
  );
}
