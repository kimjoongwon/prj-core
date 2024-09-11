import { Divider, Spacer } from '@nextui-org/react';
import { UpdateTemplateDto } from '../../../model';
import { Input } from '../../ui/Input';
import { VStack } from '../../ui/VStack';
import { PostForm } from '../Post';
import { Chips, MultiInput } from '../../ui';

interface TemplateFormProps {
  state: UpdateTemplateDto;
}

export const TemplateFormView = (props: TemplateFormProps) => {
  const { state } = props;
  return (
    <VStack className="space-y-2 pb-20">
      <MultiInput
        label="key"
        placeholder="key값을 입력해주세요."
        state={state}
        path="keys"
      />
      <Chips state={state} path="keys" />
      <Divider />
      <PostForm state={state.updatePostDto} />
    </VStack>
  );
};
