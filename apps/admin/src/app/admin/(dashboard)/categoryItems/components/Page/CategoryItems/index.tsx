'use client';

import { observer } from 'mobx-react-lite';
import { Nodes } from '@components';
import { CategoryItem } from '@__generated__/graphql';
import { CategoryItemCard } from '../CategoryItemCard';
import { Listbox } from '@nextui-org/react';

interface CategoryItemsProps {
  categoryItems: CategoryItem[];
}

export const CategoryItems = observer((props: CategoryItemsProps) => {
  const { categoryItems } = props;

  return (
    <li>
      <Nodes
        data={categoryItems}
        renderItem={categoryItem => {
          return <CategoryItemCard categoryItem={categoryItem} />;
        }}
      />
    </li>
  );
});
