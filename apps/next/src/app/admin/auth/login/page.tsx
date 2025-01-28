'use client';

import { useGetAdminAuthLoginRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { PageBuilder } from '@/builders/Page/PageBuilder';

const LoginPage = () => {
  const { data, isFetchedAfterMount } = useGetAdminAuthLoginRoute();
  const loginRouteBuilder = data?.data as RouteBuilder;

  console.log('loginRouteBuilder', loginRouteBuilder);

  if (!isFetchedAfterMount) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col w-full">
      <PageBuilder pageBuilder={loginRouteBuilder?.page} />
    </div>
  );
};

export default LoginPage;
