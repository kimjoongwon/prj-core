import { UseDto } from '../decorators/use-dto.decorator';
import { SubjectDto } from '../dtos/subject.dto';
import { AbstractEntity } from './abstract.entity';

import { Subject as SubjectEntity } from '@prisma/client';

@UseDto(SubjectDto)
export class Subject extends AbstractEntity<SubjectDto> implements SubjectEntity {
  tenancyId: string;
  name: string;
}
