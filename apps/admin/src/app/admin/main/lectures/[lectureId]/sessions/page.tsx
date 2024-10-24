'use client';

import React from 'react';
import { SessionsTable } from '@shared/frontend';
import { useSessionsPage } from './_hooks/useSessionsPage';

const SessionsPage = () => {
  const { sessions } = useSessionsPage();

  return <SessionsTable sessions={sessions} />;
};

export default SessionsPage;
