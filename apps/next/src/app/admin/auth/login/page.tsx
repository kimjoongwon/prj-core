'use client';

import { useGetAdminAuthLoginRoute } from '@shared/frontend';
import { PageBuilder } from '@/builders/Page/PageBuilder';

const LoginPage = () => {
  const { data, isFetchedAfterMount } = useGetAdminAuthLoginRoute();

  if (!isFetchedAfterMount) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col w-full">
      <PageBuilder pageBuilder={data?.data} />
    </div>
  );
};

export default LoginPage;
