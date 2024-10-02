import { getSessionsByQuery, SessionsTable } from '@shared/frontend';
import { cookies } from 'next/headers';
import React from 'react';

const SessionsPage = async () => {
  const accessToken = cookies().get('accessToken');
  const sessionsQuery = await getSessionsByQuery(
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    },
  );

  return <SessionsTable sessions={sessionsQuery.data || []} />;
};

export default SessionsPage;
