import { OmitType } from '@nestjs/swagger';
import { ContentDto } from '../content.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants';

export class CreateContentDto extends OmitType(ContentDto, [...COMMON_ENTITY_FIELDS]) {}
