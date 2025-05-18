import { Depot } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField } from '../decorator';
import { FileDto } from './file.dto';

export class DepotDto extends AbstractDto implements Depot {
  @ClassField(() => FileDto, { isArray: true })
  files: FileDto[];
}
