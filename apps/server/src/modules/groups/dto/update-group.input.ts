import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateGroupInput } from './create-group.input';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
