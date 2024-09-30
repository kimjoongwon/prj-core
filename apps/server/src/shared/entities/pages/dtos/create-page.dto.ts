import { OmitType } from '@nestjs/swagger';
import { PageDto } from './page.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreatePageDto extends OmitType(PageDto, [...COMMON_ENTITY_FIELDS]) {}
