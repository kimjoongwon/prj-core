'use client';

import { Button, Card } from '@coc/ui';
import { CategoryItemList, CategoryItems } from './_components';
import { usePage } from './_hooks';
import { FaPlus } from 'react-icons/fa';

export default function Page() {
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
}
