import { CreateUserInput } from './create-user.input';
import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password'], InputType),
) {
  @Field(type => ID!)
  id: string;
}
