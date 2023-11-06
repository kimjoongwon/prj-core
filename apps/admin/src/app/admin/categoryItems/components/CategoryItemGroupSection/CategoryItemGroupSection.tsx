import { Button } from '@coc/ui';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { CiSquareRemove } from 'react-icons/ci';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { useCategoryItemsPage } from '../../hooks';

interface CategoryItemGroupSectionProps {
  depth: number;
}
export const CategoryItemGroupSection = observer(
  (props: CategoryItemGroupSectionProps) => {
    const { depth } = props;
    const {
      handlers: { onClickCategoryItem, onClickDeleteIcon, onClickNewCategory },
      queries: {
        categoryItemTreesQuery: { data },
      },
      state,
    } = useCategoryItemsPage();

    const categoryItems = data.categoryItemTrees;

    const selectedParentCategoryItem = state.selectedCategoryItems[depth - 1];

    const categoryItemsByDepth = categoryItems
      .filter(categoryItem => categoryItem.ancestorIds.length === depth)
      .filter(categoryItem =>
        depth > 0
          ? selectedParentCategoryItem?.id === categoryItem?.parentId
          : true,
      );

    if (!selectedParentCategoryItem && depth > 0) return null;
    console.log(toJS(selectedParentCategoryItem));
    return (
      <div className="flex-1">
        <Button
          variant="solid"
          color="primary"
          fullWidth
          size="sm"
          onClick={() => {
            console.log(depth);
            console.log(toJS(selectedParentCategoryItem));
            onClickNewCategory(
              depth > 0
                ? {
                    parentId: selectedParentCategoryItem?.id,
                    ancestorIds: [
                      ...selectedParentCategoryItem?.ancestorIds,
                      selectedParentCategoryItem?.id,
                    ],
                  }
                : {
                    ancestorIds: [],
                    parentId: null,
                  },
            );
          }}
        >
          추가
        </Button>
        <Listbox>
          {categoryItemsByDepth.map(categoryItem => {
            const isSelected =
              state.selectedCategoryItems?.[depth]?.id === categoryItem.id;

            return (
              <ListboxItem
                key={categoryItem.id}
                className="h-7"
                variant="bordered"
                color={isSelected ? 'success' : 'primary'}
                startContent={
                  <>{isSelected ? <FcOpenedFolder /> : <FcFolder />}</>
                }
                endContent={
                  <CiSquareRemove
                    size={20}
                    className="text-danger"
                    onClick={e => {
                      e.stopPropagation();
                      onClickDeleteIcon(categoryItem.id);
                    }}
                  />
                }
                onClick={() => onClickCategoryItem(categoryItem)}
              >
                <div
                  className={isSelected ? 'text-success' : 'text-primary-900'}
                >
                  {categoryItem.name}
                </div>
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>
    );
  },
);
