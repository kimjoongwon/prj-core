import { Base } from '@common';
import { CategoryItem } from '@modules/category-items/model';
import { Service } from '@modules/services/models';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category extends Base {
  @Field(type => ID)
  name: string;

  @Field(type => Service)
  service: Service;

  @Field(type => CategoryItem)
  categoryItem: CategoryItem;
}
