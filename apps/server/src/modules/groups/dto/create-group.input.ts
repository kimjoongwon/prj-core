import { InputType, OmitType } from '@nestjs/graphql';
import { Group } from '../models';
import { GetOmitFields } from '@common';

@InputType()
export class CreateGroupInput extends OmitType(
  Group,
  GetOmitFields(),
  InputType,
) {}
