import { PartialType } from '@nestjs/swagger';
import { ServiceDto } from './service.dto';

export class UpdateServiceDto extends PartialType(ServiceDto) {}
