import { PartialType } from '@nestjs/swagger';
import { CreateDepotDto } from '../create/create-depot.dto';
import { ClassField } from '../../decorators';

export class UpdateDepotDto extends PartialType(CreateDepotDto) {
  @ClassField(() => File, { isArray: true })
  files: File[];
}
