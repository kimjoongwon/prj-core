import React from 'react';
import { PageProvider } from './components/Provider';
import { Users } from './components/Users';

export default function Page() {
  return (
    <PageProvider>
      <Users />
    </PageProvider>
  );
}
