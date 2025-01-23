import { Routine as RoutineEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { RoutineDto } from '../dtos';

@UseDto(RoutineDto)
export class Routine extends AbstractEntity<RoutineDto> implements RoutineEntity {
  name: string;
  contentId: string;
  tenancyId: string;
}
