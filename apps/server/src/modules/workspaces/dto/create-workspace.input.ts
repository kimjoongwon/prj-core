import { InputType, Int, Field, PartialType, OmitType } from '@nestjs/graphql';
import { Workspace } from '../models/workspace.model';
import { BaseEntity } from '@common';

@InputType()
export class CreateWorkspaceInput extends OmitType(BaseEntity, ['id']) {
  @Field(type => String)
  name: string;

  @Field(type => String)
  ownerId: string;

  @Field(type => String)
  phone: string;
}
