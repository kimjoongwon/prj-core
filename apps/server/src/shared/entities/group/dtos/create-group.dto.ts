import { OmitType } from '@nestjs/swagger';
import { GroupEntity } from '../group.entity';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateGroupDto extends OmitType(GroupEntity, COMMON_ENTITY_FIELDS) {}
