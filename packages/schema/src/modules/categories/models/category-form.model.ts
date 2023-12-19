import { Option } from '../../../common/models';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryForm {
  @Field(type => String)
  name: string;

  @Field(type => String)
  itemId: string;

  @Field(type => String)
  serviceId: string;

  @Field(type => [Option])
  itemOptions: Option[];

  @Field(type => [Option])
  serviceOptions: Option[];
}
