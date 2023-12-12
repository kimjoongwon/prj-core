import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('OptionInput')
export class Option {
  @Field(() => String)
  text: string;

  @Field(() => String)
  value: string;
}
