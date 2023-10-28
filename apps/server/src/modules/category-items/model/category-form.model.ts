import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryItemForm {
  @Field(() => String)
  name: string;

  @Field(() => String)
  parentId: string;
}

export const categoryItemForm = {
  name: '',
  parentId: 'root',
};
