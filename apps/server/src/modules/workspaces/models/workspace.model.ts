import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Workspace extends Base {
  @Field(type => String)
  name: string;
}
