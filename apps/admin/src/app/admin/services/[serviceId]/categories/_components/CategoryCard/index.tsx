import { Button, CategoryDto } from '@shared/frontend';
import { groupBy } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { state } from '../../state';

interface CategoryCardProps {
  category: CategoryDto;
}

export const CategoryCard = observer((props: CategoryCardProps) => {
  const { category } = props;
  const onClickCategoryCard = () => {
    const categoriesGroupedByParentId = groupBy(state.categories, 'parentId');
    const categories = categoriesGroupedByParentId?.[category.parentId!];

    categories?.forEach(_category => {
      if (_category.id === category.id) {
        state.openedCategory = category;
      }
    });
  };
  return (
    <Button
      variant="ghost"
      color={state.openedCategory.id === category.id ? 'primary' : 'default'}
      onClick={onClickCategoryCard}
    >
      {category?.name}
    </Button>
  );
});
