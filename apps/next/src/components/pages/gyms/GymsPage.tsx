'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainGymsPage } from '@shared/frontend';
import { PageBuilder as PageBuilderInterface } from '@shared/types';

export const GymsPage = () => {
  const { data: getAdminAdminMainGymsPageResponse } = useGetAdminMainGymsPage();
  const page = getAdminAdminMainGymsPageResponse?.data as PageBuilderInterface;

  return <PageBuilder pageBuilder={page} />;
};
