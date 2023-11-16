import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateSpaceInput } from '../dto';
import { Option } from '@common';

@ObjectType()
export class SpaceForm extends PartialType(CreateSpaceInput, ObjectType) {
  @Field(type => Option)
  ownerOptions: Option[];
}
