'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainGroundsPage } from '@shared/frontend';
import { PageBuilder as PageBuilderInterface } from '@shared/types';

export const GroundsPage = () => {
  const { data: getAdminAdminMainGymsPageResponse } =
    useGetAdminMainGroundsPage();
  const page = getAdminAdminMainGymsPageResponse?.data as PageBuilderInterface;

  return <PageBuilder pageBuilder={page} />;
};
