import { InputType, OmitType } from '@nestjs/graphql';
import { Group } from '../models/group.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateGroupInput extends OmitType(Group, BASE_FIELDS, InputType) {}
