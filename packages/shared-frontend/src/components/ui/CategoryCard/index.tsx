import { CategoryDto } from '../../../model/categoryDto';
import Button from '../Button';

interface CategoryCardProps {
  category: CategoryDto;
  selected?: boolean;
  onClickEdit?: (category: CategoryDto) => void;
  onClickDelete?: (category: CategoryDto) => void;
  onClick?: (category: CategoryDto) => void;
}

export const CategoryCard = (props: CategoryCardProps) => {
  const {
    category,
    selected = false,
    onClickDelete = undefined,
    onClickEdit = undefined,
    onClick = undefined,
  } = props;

  return (
    <div
      className="border-1 p-2 hover:bg-gray-100 cursor-pointer flex justify-between font-bold"
      color={selected ? 'primary' : 'default'}
      onClick={() => onClick && onClick(category)}
    >
      <div>{category.name}</div>
      <div>
        {onClickEdit && (
          <Button color="default" onClick={() => onClickEdit(category)}>
            수정
          </Button>
        )}
        {onClickDelete && (
          <Button color="default" onClick={() => onClickDelete(category)}>
            삭제
          </Button>
        )}
      </div>
    </div>
  );
};
