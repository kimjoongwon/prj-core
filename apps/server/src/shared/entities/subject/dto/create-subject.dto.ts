import { OmitType, PartialType } from '@nestjs/swagger';
import { SubjectDto } from './subject.dto';
import { COMMON_ENTITY_FIELDS } from 'src/shared/constants';

export class CreateSubjectDto extends OmitType(SubjectDto, COMMON_ENTITY_FIELDS) {}
