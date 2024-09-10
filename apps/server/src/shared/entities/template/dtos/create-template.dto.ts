import { OmitType } from '@nestjs/swagger';
import { TemplateDto } from './template.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateTemplateDto extends OmitType(TemplateDto, [...COMMON_ENTITY_FIELDS]) {}
