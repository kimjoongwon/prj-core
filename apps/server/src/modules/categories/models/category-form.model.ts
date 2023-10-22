import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { UpdateCategoryInput } from '../dto/update-category.input';

@ObjectType()
export class CategoryForm {
  @Field(type => String, { nullable: true })
  id: string;

  @Field(type => String)
  name: string;

  @Field(type => String, { nullable: true })
  categoryItemId: string;

  @Field(type => String, { nullable: true })
  serviceId: string;
}

export const categoryForm = {
  name: '',
  categoryItemId: null,
  serviceId: null,
};
