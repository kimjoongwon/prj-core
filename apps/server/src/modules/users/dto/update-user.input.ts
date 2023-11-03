import { CreateUserInput } from './create-user.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(type => ID!)
  id: string;
}
