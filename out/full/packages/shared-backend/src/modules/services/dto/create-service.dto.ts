import { OmitType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

import { ServiceEntity } from '../service.entity';

export class CreateServiceDto extends OmitType(ServiceEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
