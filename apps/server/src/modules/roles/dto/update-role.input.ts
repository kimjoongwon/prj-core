import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Role } from '../models/role.model';

@InputType()
export class UpdateRoleInput extends PartialType(Role, InputType) {
  @Field(type => String, { nullable: true })
  id: string;
}
