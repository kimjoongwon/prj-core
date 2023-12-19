import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from '../../../common/interfaces';

@ObjectType()
export class CategoryItem extends Base {
  @Field(type => String)
  name: string;

  @Field(type => String)
  tag: string;

  @Field(type => [String], { defaultValue: [] })
  ancestorIds: string[];

  @Field(type => String, { nullable: true })
  parentId: string;

  @Field(type => String)
  tenantId: string;
}
