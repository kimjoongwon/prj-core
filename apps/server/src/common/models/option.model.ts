import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Option {
  @Field(() => String)
  name: string;

  @Field(() => String)
  value: string;
}
