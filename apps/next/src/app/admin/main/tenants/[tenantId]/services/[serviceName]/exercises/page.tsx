'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainExercisesPage } from '@shared/frontend';

const ExercisesPage = () => {
  const { data: response } = useGetAdminMainExercisesPage();
  const page = response?.data as any;

  return <PageBuilder pageBuilder={page} />;
};

export default ExercisesPage;
