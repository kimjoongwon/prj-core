import { Program as ProgramEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { ProgramDto } from '../dto';

@UseDto(ProgramDto)
export class Program extends AbstractEntity<ProgramDto> implements ProgramEntity {
  instructorId: string;
  capacity: number;
  routineId: string;
  sessionId: string;
  tenancyId: string;
}
