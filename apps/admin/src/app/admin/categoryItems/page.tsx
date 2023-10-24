'use client';

import { Button } from '@coc/ui';
import { usePage } from './_hooks';
import { FaFolder, FaPlus, FaTrash } from 'react-icons/fa';
import { Listbox, ListboxItem } from '@nextui-org/react';

export default function Page() {
  const {
    meta: {
      section: {
        categoryItem: { onClickCategoryItem },
        categoryItemTrees,
        header: { onClickNew },
      },
    },
  } = usePage();

  return (
    <div className="flex flex-1 space-x-4">
      {categoryItemTrees.map((categoryItemTree, index) => {
        const isLast = index >= 2;
        return (
          <div key={index} className="flex flex-1 flex-col">
            <Button
              fullWidth
              onClick={onClickNew}
              startContent={<FaPlus />}
              endContent={<FaFolder />}
            >
              New Category
            </Button>
            <Listbox>
              {categoryItemTree.map(categoryItem => {
                return (
                  <ListboxItem
                    startContent={<FaFolder />}
                    endContent={<FaTrash />}
                    onClick={
                      isLast
                        ? undefined
                        : () => onClickCategoryItem(categoryItem)
                    }
                    key={categoryItem.id}
                  >
                    <div>{categoryItem.name}</div>
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
