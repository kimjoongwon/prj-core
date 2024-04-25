import { CreateCategoryDto, UpdateCategoryDto } from '../../../model';
import { Input, VStack } from '../../ui';

interface CategoryFormProps {
  state: CreateCategoryDto | UpdateCategoryDto;
}

export const CategoryForm = (props: CategoryFormProps) => {
  const { state } = props;
  return (
    <VStack>
      <Input placeholder="카테고리명" state={state} path="name" />
    </VStack>
  );
};
