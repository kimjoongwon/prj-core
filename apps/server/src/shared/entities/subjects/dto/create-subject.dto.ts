import { OmitType, PartialType } from '@nestjs/swagger';
import { SubjectDto } from './subject.dto';

export class CreateSubjectDto extends OmitType(SubjectDto, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
