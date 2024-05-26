import { PartialType } from '@nestjs/swagger';
import { ServiceEntity } from '../../models/service.entity';

export class UpdateServiceDto extends PartialType(ServiceEntity) {}
