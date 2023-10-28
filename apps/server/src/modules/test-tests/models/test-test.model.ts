import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TestTest extends Base {
  @Field(type => String)
  name: string;
}
