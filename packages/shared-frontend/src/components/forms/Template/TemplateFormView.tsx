import { TemplateFormProps } from '.';
import { TemplateNames } from '../../../model';
import { Select } from '../../ui';
import { VStack } from '../../ui/VStack';
import { PostForm } from '../Post';

interface TemplateFormViewProps extends TemplateFormProps {}

export const TemplateFormView = (props: TemplateFormViewProps) => {
  const { state } = props;

  const templateNameOptions = Object.keys(TemplateNames).map(name => ({
    text: name,
    value: name,
  }));

  return (
    <VStack className="space-y-2 pb-20">
      <Select state={state} path="name" options={templateNameOptions} />
      <PostForm state={state.post} />
    </VStack>
  );
};
