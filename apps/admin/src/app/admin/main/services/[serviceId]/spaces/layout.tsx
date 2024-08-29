import React from 'react';
import { Container } from '@shared/frontend';
import { ServicePageParams } from '../page';

interface SpaceLayoutProps {
  children: React.ReactNode;
}

export type SpacesPageParams = ServicePageParams;

const SpacesLayout = async (props: SpaceLayoutProps) => {
  console.log('server redender spaces');
  // const cookieStore = cookies();
  // const accessToken = cookieStore.get('accessToken');
  // const queryClient = new QueryClient();

  // // await fetch('http://localhost:3005/api/admin/spaces', {
  // //   headers: { Authorization: `bearer ${access_token?.value}` },
  // // });

  // // console.log('???');

  // await queryClient.prefetchQuery({
  //   queryKey: [getGetSpacesByQueryQueryKey()],
  //   queryFn: () => getSpacesByQuery(),
  // });

  return <Container className="h-full">test</Container>;
};

export default SpacesLayout;
