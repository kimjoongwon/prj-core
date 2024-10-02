import React from 'react';
import { getSpacesByQuery, SpacesTable } from '@shared/frontend';
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

  return <SpacesTable spaces={spacesByQuery.data || []} />;
};

export default SpacesPage;
