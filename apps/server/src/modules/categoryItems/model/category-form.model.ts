import { ObjectType, PartialType } from '@nestjs/graphql';
import { UpdateCategoryItemInput } from '../dto/update-category-item.input';

@ObjectType()
export class CategoryItemForm extends PartialType(
  UpdateCategoryItemInput,
  ObjectType,
) {}

export const categoryItemForm = {
  name: '',
  parentId: '',
};
