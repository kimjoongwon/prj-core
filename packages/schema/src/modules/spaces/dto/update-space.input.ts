import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSpaceInput } from './create-space.input';

@InputType()
export class UpdateSpaceInput extends PartialType(CreateSpaceInput, InputType) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
