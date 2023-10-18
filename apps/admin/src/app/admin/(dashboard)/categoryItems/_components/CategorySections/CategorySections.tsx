'use client';

import { Button, Card } from '@coc/ui';
import { usePage } from '../../_hooks';
import { CategoryItemList } from '../CategoryItemList/CategoryItemList';
import { CategoryItems } from '../CategoryItems/CategoryItems';
import { FaPlus } from 'react-icons/fa';

export const CategorySections = () => {
  const {
    meta: {
      section: { categoryItemTrees },
    },
  } = usePage();

  return (
    <Card>
      {categoryItemTrees.map((categoryItemTree, index) => {
        return (
          <CategoryItemList key={index}>
            <Button variant="ghost" startContent={<FaPlus />}>
              New Category
            </Button>
            <CategoryItems categoryItems={categoryItemTree} />
          </CategoryItemList>
        );
      })}
    </Card>
  );
};
