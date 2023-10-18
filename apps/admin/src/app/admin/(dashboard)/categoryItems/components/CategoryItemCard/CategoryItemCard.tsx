'use client';

import { CategoryItem } from '@__generated__/graphql';
import { useModal } from '@hooks';
import { observer } from 'mobx-react-lite';

interface CategoryItemProps {
  categoryItem: CategoryItem;
}

export const CategoryItemCard = observer((props: CategoryItemProps) => {
  const { categoryItem } = props;
  const modal = useModal();
  const onClickItem = () => {
    console.log(categoryItem);
    modal.open();
  };
  return <ul onClick={onClickItem}>{categoryItem.name}</ul>;
});
