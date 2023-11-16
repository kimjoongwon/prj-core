import {
  Field,
  IntersectionType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { CreateGroupInput } from '../dto';
import { Group } from './group.model';

@ObjectType()
class Form {}

@ObjectType()
export class GroupForm extends OmitType(
  Group,
  ['createdAt', 'deletedAt', 'updatedAt'],
  ObjectType,
) {
  @Field(type => String, { nullable: true })
  id: string;
}

export const groupForm = {
  name: '',
};
