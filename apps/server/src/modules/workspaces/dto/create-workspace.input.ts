import { Base } from '@common';
import {
  InputType,
  Int,
  Field,
  PartialType,
  OmitType,
  ObjectType,
} from '@nestjs/graphql';

@InputType()
export class CreateWorkspaceInput extends OmitType(
  Base,
  ['id'],
  ObjectType,
) {
  @Field(type => String)
  name: string;

  @Field(type => String)
  ownerId: string;

  @Field(type => String)
  phone: string;
}
