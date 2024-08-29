import React from 'react';
import {
  Container,
  getGetSpacesByQueryQueryKey,
  getSpacesByQuery,
} from '@shared/frontend';
import { ServicePageParams } from '../page';
import { cookies, headers } from 'next/headers';
import { QueryClient } from '@tanstack/react-query';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export type SpacesPageParams = ServicePageParams;

const SpacesLayout = async (props: SpaceLayoutProps) => {
  const cookieStore = cookies();
  const access_token = cookieStore.get('accessToken');
  const authorization = headers().get('authorization');

  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: [getGetSpacesByQueryQueryKey()],
    queryFn: () =>
      getSpacesByQuery(
        {},
        { headers: { authorization: `bearer ${access_token}` } },
      ),
  });

  return <Container className="h-full">{props.children}</Container>;
};

export default SpacesLayout;
