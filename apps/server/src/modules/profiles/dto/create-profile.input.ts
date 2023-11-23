import { InputType, OmitType } from '@nestjs/graphql';
import { Profile } from '../models/profile.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateProfileInput extends OmitType(
  Profile,
  BASE_FIELDS,
  InputType,
) {}
