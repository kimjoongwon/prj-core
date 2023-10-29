import { $Enums } from '@coc/db';
import { Field, InputType } from '@nestjs/graphql';
import { Roles } from '../models';

@InputType()
export class CreateRoleInput {
  @Field(type => Roles)
  name: $Enums.Roles;

  @Field(type => [String], { defaultValue: [] })
  accessPages: string[];
}
