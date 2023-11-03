import { CreateProfileInput } from './create-profile.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => ID!)
  id: string;
}
