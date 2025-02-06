import { NumberField, UUIDField } from '../decorators';
import { AbstractDto } from './abstract.dto';
import { Program as ProgramEntity } from '@prisma/client';

export class ProgramDto extends AbstractDto implements ProgramEntity {
  @UUIDField()
  instructorId: string;

  @NumberField()
  capacity: number;

  @UUIDField()
  routineId: string;

  @UUIDField()
  sessionId: string;

  @UUIDField()
  tenancyId: string;
}
