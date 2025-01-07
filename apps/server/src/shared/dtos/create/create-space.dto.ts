import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from '../../../dtos/space.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateSpaceDto extends OmitType(SpaceDto, ['groups', ...COMMON_ENTITY_FIELDS]) {}
