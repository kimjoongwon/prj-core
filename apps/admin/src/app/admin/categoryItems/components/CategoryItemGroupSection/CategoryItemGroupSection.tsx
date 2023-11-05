import { Listbox, ListboxItem } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { CiSquareRemove, CiSquarePlus } from 'react-icons/ci';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { useCategoryItemsPage } from '../../hooks';
interface CategoryItemGroupSectionProps {
  depth: number;
  categoryItemGroupSection: ReturnType<
    typeof useCategoryItemsPage
  >['categoryItemGroupSection'];
}
export const CategoryItemGroupSection = observer(
  (props: CategoryItemGroupSectionProps) => {
    const { categoryItemGroupSection, depth } = props;
    const {
      state,
      onClickDeleteIcon,
      onClickNewCategory,
      onClickCategoryItem,
    } = categoryItemGroupSection;

    const selectedParentCategoryItemByDepth = state.categoryItems.find(
      category =>
        category.ancestorIds.length === depth - 1 && category.isSelected,
    );

    return (
      <Listbox>
        {state.categoryItems
          .filter(categoryItem => categoryItem.ancestorIds.length === depth)
          .filter(categoryItem =>
            depth > 0
              ? categoryItem.parentId === selectedParentCategoryItemByDepth?.id
              : true,
          )
          .map(categoryItem => {
            return (
              <ListboxItem
                className="h-7"
                key={categoryItem.id}
                variant="bordered"
                color={categoryItem.isSelected ? 'success' : 'primary'}
                startContent={
                  <>
                    {categoryItem.isSelected ? (
                      <FcOpenedFolder />
                    ) : (
                      <FcFolder />
                    )}
                  </>
                }
                endContent={
                  <>
                    <CiSquarePlus
                      size={20}
                      className="text-success"
                      onClick={onClickNewCategory}
                    />
                    <CiSquareRemove
                      size={20}
                      className="text-danger"
                      onClick={e => {
                        e.stopPropagation();
                        onClickDeleteIcon(categoryItem.id);
                      }}
                    />
                  </>
                }
                onClick={() => onClickCategoryItem(categoryItem)}
              >
                <div
                  className={
                    categoryItem.isSelected
                      ? 'text-success'
                      : 'text-primary-900'
                  }
                >
                  {categoryItem.name}
                </div>
              </ListboxItem>
            );
          })}
      </Listbox>
    );
  },
);
