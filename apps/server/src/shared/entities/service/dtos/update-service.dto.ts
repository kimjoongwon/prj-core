import { PartialType } from '@nestjs/swagger';
import { ServiceEntity } from '../service.entity';

export class UpdateServiceDto extends PartialType(ServiceEntity) {}
