import { OmitType } from '@nestjs/swagger';
import { GroupDto } from '../group.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';

export class CreateGroupDto extends OmitType(GroupDto, [
  ...COMMON_ENTITY_FIELDS,
  'associations',
  'service',
  'tenant',
]) {}
