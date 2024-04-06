import { createZodDto } from 'nestjs-zod';
import { serviceEntitySchema } from '../service.entity';

export const updateServiceDtoSchema = serviceEntitySchema.partial();
export class UpdateServiceDto extends createZodDto(updateServiceDtoSchema) {}
