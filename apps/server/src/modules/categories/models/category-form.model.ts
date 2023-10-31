import { Option } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryForm {
  @Field(type => String)
  name: string;

  @Field(type => String)
  categoryItemId: string;

  @Field(type => String)
  serviceId: string;

  @Field(type => [Option])
  categoryItemOptions: Option[];

  @Field(type => [Option])
  serviceOptions: Option[];
}
