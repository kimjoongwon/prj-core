'use client';

import { Button, Card } from '@coc/ui';
import { CategoryItemList, CategoryItems } from './_components';
import { usePage } from './_hooks';
import { FaFolder, FaPlus } from 'react-icons/fa';

export default function Page() {
  const {
    state: { parentIds },
    meta: {
      section: {
        categoryItemTrees,
        header: { onClickNew },
      },
    },
  } = usePage();

  return (
    <Card>
      {categoryItemTrees.map((categoryItemTree, index) => {
        return (
          <CategoryItemList key={index}>
            <Button
              variant="ghost"
              startContent={<FaPlus />}
              onClick={() => onClickNew(parentIds[index])}
              endContent={<FaFolder />}
            >
              New Category
            </Button>
            <CategoryItems categoryItems={categoryItemTree} />
          </CategoryItemList>
        );
      })}
    </Card>
  );
}
