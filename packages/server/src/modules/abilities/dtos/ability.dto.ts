import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { subjectDtoSchema } from '../../subjects/dtos/subject.dto';

export const AbilityDtoSchema = z.object({
  subject: subjectDtoSchema,
});

export class AbilityDto extends createZodDto(AbilityDtoSchema) {}
