import { PartialType } from '@nestjs/swagger';
import { ServiceEntity } from '../../entities';

export class UpdateServiceDto extends PartialType(ServiceEntity) {}
