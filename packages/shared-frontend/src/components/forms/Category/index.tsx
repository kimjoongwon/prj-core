import { observer } from 'mobx-react-lite';
import { Input, VStack } from '../../ui';

interface CategoryFormProps {
  type: 'create' | 'update' | 'read';
  state: any;
}

export const CategoryForm = observer((props: CategoryFormProps) => {
  const { state } = props;

  return (
    <VStack>
      <Input
        isReadOnly={props.type === 'read'}
        label="카테고리명"
        placeholder="카테고리명"
        state={state}
        path="name"
      />
    </VStack>
  );
});
