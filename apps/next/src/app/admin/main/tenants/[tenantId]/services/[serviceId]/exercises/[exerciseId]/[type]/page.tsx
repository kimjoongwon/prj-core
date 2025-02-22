'use client';

import { Form } from '@heroui/react';
import {
  ContentForm,
  ExerciseForm,
  useGetAdminMainExerciseEditPage,
} from '@shared/frontend';
import { PageBuilder, RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const ExerciseEditPage = () => {
  const params = useParams();
  const exerciseId = params.exerciseId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainExerciseEditPage(exerciseId, type);
  const page = response?.data as PageBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return (
    <Form>
      <ExerciseForm state={page.state?.form.inputs} />
    </Form>
  );
};

export default ExerciseEditPage;
