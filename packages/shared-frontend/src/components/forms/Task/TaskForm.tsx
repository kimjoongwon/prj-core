import { Text } from '../../ui';
import { Section } from '../../ui/Section/Section';
import { LabelInput } from '../inputs/Label/LabelInput';
import { NameInput } from '../inputs/Name/NameInput';
type TaskFormProps = {
  state: {
    name: string;
    label: string;
  };
};

export const TaskForm = (props: TaskFormProps) => {
  const { state } = props;
  return (
    <Section>
      <Text variant="h5">서비스 정보</Text>
      <NameInput state={state} path="name" />
      <LabelInput state={state} path="label" />
    </Section>
  );
};
