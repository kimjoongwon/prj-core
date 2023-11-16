import { InputType, OmitType } from '@nestjs/graphql';
import { Group } from '../models';

@InputType()
export class CreateGroupInput extends OmitType(
  Group,
  ['id', 'createdAt', 'updatedAt', 'deletedAt'],
  InputType,
) {}
