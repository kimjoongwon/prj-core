import { Button, CategoryDto, useUpdateCategory } from '@shared/frontend';
import { groupBy } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { state } from '../../state';
import { ButtonGroup } from '@nextui-org/react';

interface CategoryCardProps {
  category: CategoryDto;
}

export const CategoryCard = observer((props: CategoryCardProps) => {
  const { category } = props;
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const onClickCategoryCard = () => {
    const categoriesGroupedByParentId = groupBy(state.categories, 'parentId');
    const categories = categoriesGroupedByParentId?.[category.parentId!];

    categories?.forEach(_category => {
      if (_category.id === category.id) {
        state.openedCategory = category;
      }
    });
  };

  const onClickDeleteCategory = async () => {
    updateCategory({
      categoryId: category.id,
      data: {
        ...category,
        // @ts-ignore
        deletedAt: new Date(),
      },
    });
  };

  const onClickEdit = () => {};

  return (
    <div
      className="border-1 p-2 hover:bg-gray-100 cursor-pointer flex justify-between font-bold"
      color={state.openedCategory.id === category.id ? 'primary' : 'default'}
      onClick={onClickCategoryCard}
    >
      {category?.name}
      <ButtonGroup>
        <Button color="default" onClick={onClickEdit}>
          수정
        </Button>
        <Button color="default" onClick={onClickDeleteCategory}>
          삭제
        </Button>
      </ButtonGroup>
    </div>
  );
});
