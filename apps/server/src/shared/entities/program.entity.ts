import { Program as ProgramEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { ProgramDto } from '../dtos';
import { UUIDField } from '../decorators/field.decorators';

@UseDto(ProgramDto)
export class Program extends AbstractEntity<ProgramDto> implements ProgramEntity {
  @UUIDField()
  routineId: string;

  @UUIDField()
  sessionId: string;

  @UUIDField()
  tenancyId: string;
}
