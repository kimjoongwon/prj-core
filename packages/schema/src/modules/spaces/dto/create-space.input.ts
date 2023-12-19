import { InputType, OmitType } from '@nestjs/graphql';
import { Space } from '../models/space.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateSpaceInput extends OmitType(Space, BASE_FIELDS, InputType) {}
