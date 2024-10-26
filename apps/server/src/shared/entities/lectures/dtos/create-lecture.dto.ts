import { OmitType } from '@nestjs/swagger';
import { LectureDto } from './lecture.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateLectureDto extends OmitType(LectureDto, [...COMMON_ENTITY_FIELDS,]) {}
