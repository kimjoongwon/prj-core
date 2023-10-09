import { SignupInput } from '@modules/auth/dto/signup.input';
import { CreateUserInput } from './create-user.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(type => Int)
  id: number;
}
