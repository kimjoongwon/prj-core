import { $Enums, Service as ServiceEntity } from '@prisma/client';
import { UseDto } from '../decorator/use-dto.decorator';
import { ServiceDto } from '../dto';
import { AbstractEntity } from './abstract.entity';

@UseDto(ServiceDto)
export class Service extends AbstractEntity<ServiceDto> implements ServiceEntity {
  name: $Enums.ServiceNames;
  label: string;
}
