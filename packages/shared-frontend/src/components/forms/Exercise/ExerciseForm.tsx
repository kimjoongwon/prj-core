import { CreateExerciseDto } from '../../../model';
import { Text } from '../../ui';
import { Section } from '../../ui/Section/Section';
import { ContentForm } from '../Content/ContentForm';
import { TaskForm } from '../Task/TaskForm';
type ExerciseFormProps = {
  state: CreateExerciseDto;
};

export const ExerciseForm = (props: ExerciseFormProps) => {
  const { state } = props;
  return (
    <Section>
      <Text variant="h5">서비스 정보</Text>
      <TaskForm state={state.task} />
      <ContentForm state={state.task.content} />
    </Section>
  );
};
