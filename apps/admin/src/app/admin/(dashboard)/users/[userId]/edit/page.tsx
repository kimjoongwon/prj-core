import React from 'react';
import { Provider } from './components/Provider';
import { UserEdit } from './components/UserEdit';

export default function Page() {
  return (
    <Provider>
      <UserEdit />
    </Provider>
  );
}
