import { OmitType } from '@nestjs/swagger';
import { RoleClassificationDto } from '../role-classification.dto';
import { COMMON_ENTITY_FIELDS } from '../../constant/entity-common-fields';

export class CreateRoleClassificationDto extends OmitType(RoleClassificationDto, [
  ...COMMON_ENTITY_FIELDS,
  'category',
  'role',
]) {}
