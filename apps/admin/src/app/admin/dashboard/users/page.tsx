'use client';

import { UsersPage } from '@pages';
import { PageProvider } from '@providers';
import React from 'react';

export default function Page() {
  return (
    <PageProvider>
      <UsersPage />
    </PageProvider>
  );
}
