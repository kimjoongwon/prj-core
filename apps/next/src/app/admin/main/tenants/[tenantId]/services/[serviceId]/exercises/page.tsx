'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainExercisesPage } from '@shared/frontend';

const ExercisesPage = () => {
  const { data: response } = useGetAdminMainExercisesPage();
  const page = response?.data as any;

  return <PageBuilder pageBuilder={page} />;
};

export default ExercisesPage;
