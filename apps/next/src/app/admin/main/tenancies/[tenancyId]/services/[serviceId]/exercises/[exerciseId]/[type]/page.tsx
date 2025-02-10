'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainExerciseEditPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const ExerciseEditPage = () => {
  const params = useParams();
  const exerciseId = params.exerciseId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainExerciseEditPage(exerciseId, type);
  const page = response?.data as RouteBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default ExerciseEditPage;
