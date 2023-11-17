import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Group } from '../models/group.model';
import { CreateGroupInput } from '.';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
