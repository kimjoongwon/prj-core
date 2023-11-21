import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('OptionInput')
export class Option {
  @Field(() => String)
  name: string;

  @Field(() => String)
  value: string;
}
