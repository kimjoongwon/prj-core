import { PostFormProps } from '.';
import { Editor, Input, VStack } from '../../ui';
import Textarea from '../../ui/Textarea';

interface PostFormViewProps extends PostFormProps {}

export const PostFormView = (props: PostFormViewProps) => {
  const { state } = props;
  return (
    <VStack className="space-y-4">
      <Input
        state={state}
        path="title"
        label="타이틀"
        placeholder="타이틀을 입력해주세요."
      />
      {state.type === 'TEXT' && (
        <Textarea
          state={state}
          path="content"
          label="내용"
          placeholder="내용을 입력해주세요."
        />
      )}
      {state.type === 'HTML' && <Editor state={state} path="content" />}
    </VStack>
  );
};
