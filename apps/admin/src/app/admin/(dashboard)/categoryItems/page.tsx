'use client';

import { Button } from '@coc/ui';
import { usePage } from './_hooks';
import { FaFolder, FaPlus } from 'react-icons/fa';
import { Listbox, ListboxItem } from '@nextui-org/react';

export default function Page() {
  const {
    state: { parentIds },
    meta: {
      section: {
        categoryItem: { onClickCategoryItem },
        categoryItemTrees,
        header: { onClickNew },
      },
    },
  } = usePage();

  return (
    <div className="flex flex-1">
      {categoryItemTrees.map((categoryItemTree, index) => {
        return (
          <div className="flex flex-1 flex-col">
            <Button
              fullWidth
              variant="ghost"
              startContent={<FaPlus />}
              onClick={() => onClickNew(parentIds[index])}
              endContent={<FaFolder />}
            >
              New Category
            </Button>
            <Listbox>
              {categoryItemTree.map(categoryItem => {
                return (
                  <ListboxItem
                    onClick={() => onClickCategoryItem(categoryItem.id)}
                    key={categoryItem.id}
                  >
                    {categoryItem.name}
                  </ListboxItem>
                );
              })}
            </Listbox>
          </div>
        );
      })}
    </div>
  );
}
