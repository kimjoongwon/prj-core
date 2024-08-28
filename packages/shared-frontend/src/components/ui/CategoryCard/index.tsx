import { observer } from 'mobx-react-lite';
import { CategoryDto } from '../../../model/categoryDto';
import { Button } from '../Button';
import { ButtonGroup } from '@nextui-org/react';

interface CategoryCardProps {
  category: CategoryDto;
  selected?: boolean;
  onClickEdit?: (category: CategoryDto) => void;
  onClickDelete?: (category: CategoryDto) => void;
  onClickCard?: (category: CategoryDto) => void;
  onClickDetail?: (category: CategoryDto) => void;
  onClickCreate?: (category: CategoryDto) => void;
}

export const CategoryCard = observer((props: CategoryCardProps) => {
  const {
    category,
    selected = false,
    onClickDelete = undefined,
    onClickEdit = undefined,
    onClickCard = undefined,
    onClickDetail = undefined,
    onClickCreate = undefined,
  } = props;

  return (
    <div
      className="border-1 p-2 hover:bg-gray-100 cursor-pointer flex justify-between font-bold"
      color={selected ? 'primary' : 'default'}
      onClick={() => onClickCard && onClickCard(category)}
    >
      <div>{category.name}</div>
      <ButtonGroup>
        {onClickDetail && (
          <Button onClick={() => onClickDetail(category)}>상세</Button>
        )}
        {onClickCreate && (
          <Button onClick={() => onClickCreate(category)}>생성</Button>
        )}
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
      </ButtonGroup>
    </div>
  );
});
