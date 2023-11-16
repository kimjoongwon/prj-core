import { GetOmitFields } from '@common';
import { InputType, OmitType } from '@nestjs/graphql';
import { Space } from '../models/space.model';

@InputType()
export class CreateSpaceInput extends OmitType(
  Space,
  [...GetOmitFields(), 'owner'],
  InputType,
) {}
