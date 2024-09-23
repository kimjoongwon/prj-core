import { OmitType } from '@nestjs/swagger';
import { SubjectDto } from './subject.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateSubjectDto extends OmitType(SubjectDto, COMMON_ENTITY_FIELDS) {}
