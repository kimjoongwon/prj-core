import { createZodDto } from 'nestjs-zod';
import { pageEntitySchema } from '../page.entity';

export const pageDtoSchema = createZodDto(pageEntitySchema);
