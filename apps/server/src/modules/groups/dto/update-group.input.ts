import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Group } from '../models/group.model';

@InputType()
export class UpdateGroupInput extends PartialType(Group, InputType) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
