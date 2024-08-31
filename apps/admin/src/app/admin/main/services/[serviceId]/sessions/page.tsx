import { getSessionsByQuery, SessionsTable } from '@shared/frontend';
import { cookies } from 'next/headers';

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

  console.log('sessionsQuery', sessionsQuery);

  return <SessionsTable sessions={sessionsQuery.data || []} />;
};

export default SessionsPage;
