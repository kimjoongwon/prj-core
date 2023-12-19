import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Role } from '../models/role.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateRoleInput extends PartialType(
  OmitType(Role, BASE_FIELDS, InputType),
  InputType,
) {}
