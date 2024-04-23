import {
  Button,
  getGetCategoriesQueryKey,
  HStack,
  Input,
  Spacer,
  useCreateCategory,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { state } from '../../state';

export const CategoryForm = observer(() => {
  const queryClient = useQueryClient();
  const { mutate } = useCreateCategory({
    mutation: {
      onSuccess: () => {
        const queryKey = getGetCategoriesQueryKey();

        queryClient.invalidateQueries({
          queryKey,
        });
      },
    },
  });

  const onClickCreateCategory = () => {
    mutate({
      data: {
        ancestorIds: [
          ...state.openedCategory?.ancestorIds,
          state.openedCategory.id,
        ],
        name: state.form.name,
        parentId: state.openedCategory.id,
        serviceId: state.openedCategory.serviceId,
        spaceId: state.openedCategory.spaceId,
      },
    });
  };

  return (
    <HStack>
      <Input placeholder="카테고리명" state={state} path="form.name" />
      <Spacer x={3} />
      <Button onClick={onClickCreateCategory}>생성</Button>
    </HStack>
  );
});
