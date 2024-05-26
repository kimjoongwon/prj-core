import { OmitType } from '@nestjs/swagger';
import { ServiceEntity } from '../../entities';


export class CreateServiceDto extends OmitType(ServiceEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
