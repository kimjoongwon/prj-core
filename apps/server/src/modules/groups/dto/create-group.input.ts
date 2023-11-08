import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Group } from '../models';

@InputType()
export class CreateGroupInput extends OmitType(
  Group,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {
  @Field(type => String)
  name: string;

  @Field(type => String)
  serviceId: string;

  @Field(type => String)
  categoryId: string;
}
