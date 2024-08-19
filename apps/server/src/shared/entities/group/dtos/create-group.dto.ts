import { OmitType } from '@nestjs/swagger';
import { GroupEntity } from '../group.entity';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';

export class CreateGroupDto extends OmitType(GroupEntity, COMMON_ENTITY_FIELDS) {}
