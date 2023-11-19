import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Role } from '../models/role.model';

@InputType()
export class UpdateRoleInput extends PartialType(Role, InputType) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
