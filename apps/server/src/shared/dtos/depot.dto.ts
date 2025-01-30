import { Depot } from '@prisma/client';
import { AbstractDto } from './abstract.dto';

export class DepotDto extends AbstractDto implements Depot {}
