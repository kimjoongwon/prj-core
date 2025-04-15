'use client';

import { Form } from '@heroui/react';
import {
  Button,
  createExercise,
  ExerciseForm,
  HStack,
  updateExercise,
  useGetAdminMainExerciseEditPage,
} from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { toJS } from 'mobx';
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
    <Form className="flex flex-col w-full">
      <HStack className="flex-grow w-full justify-between">
        <Button>목록</Button>
        <Button
          color="primary"
          onPress={() => {
            if (exerciseId === 'new') {
              createExercise(toJS(page.state?.form.inputs));
            } else {
              updateExercise(exerciseId, toJS(page.state?.form.inputs));
            }
          }}
        >
          저장
        </Button>
      </HStack>
      <ExerciseForm state={page.state?.form.inputs} />
    </Form>
  );
};

export default ExerciseEditPage;
