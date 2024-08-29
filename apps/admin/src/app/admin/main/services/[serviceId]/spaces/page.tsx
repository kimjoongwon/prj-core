export const dynamic = 'force-dynamic';

import React from 'react';
import { Container, getSpacesByQuery, SpacesTable } from '@shared/frontend';
import { cookies } from 'next/headers';

const SpacesPage = async () => {
  const accessToken = cookies().get('accessToken');
  const spacesByQuery = await getSpacesByQuery(
    {},
    {
      headers: {
        authorization: `Bearer ${accessToken?.value}`,
      },
    },
  );

  return (
    <Container className="max-w-screen-xl">
      <SpacesTable spaces={spacesByQuery.data || []} />
    </Container>
  );
};

export default SpacesPage;
