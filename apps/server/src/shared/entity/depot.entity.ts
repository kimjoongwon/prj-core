import { UseDto } from '../decorator/use-dto.decorator';
import { DepotDto } from '../dto/depot.dto';
import { AbstractEntity } from './abstract.entity';
import { Depot as DepotEntity } from '@prisma/client';

@UseDto(DepotDto)
export class Depot extends AbstractEntity<DepotDto> implements DepotEntity {}
