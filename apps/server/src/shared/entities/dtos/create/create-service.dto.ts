import { OmitType } from '@nestjs/swagger';
import { ServiceEntity } from '../../models/service.entity';

export class CreateServiceDto extends OmitType(ServiceEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
