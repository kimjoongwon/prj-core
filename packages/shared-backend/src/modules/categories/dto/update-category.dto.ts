import { ServiceEntity } from '../../services/service.entity';
import { PartialType } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(ServiceEntity) {}
