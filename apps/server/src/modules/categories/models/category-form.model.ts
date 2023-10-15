import { ObjectType, PartialType } from '@nestjs/graphql';
import { UpdateCategoryInput } from '../dto/update-category.input';

@ObjectType()
export class CategoryForm extends PartialType(
  UpdateCategoryInput,
  ObjectType,
) {}

export const categoryForm = {
  name: '',
  categoryItem: null,
};
