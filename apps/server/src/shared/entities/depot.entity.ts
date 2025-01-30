import { UseDto } from '../decorators/use-dto.decorator';
import { DepotDto } from '../dtos/depot.dto';
import { AbstractEntity } from './abstract.entity';
import { Depot as DepotEntity } from '@prisma/client';

@UseDto(DepotDto)
export class Depot extends AbstractEntity<DepotDto> implements DepotEntity {}
