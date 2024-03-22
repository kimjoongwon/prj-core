import { z } from 'nestjs-zod/z';
import { AbilityDtoSchema } from '../../abilities/dtos/ability.dto';
import { createZodDto } from 'nestjs-zod';

export const subjectDtoSchema = z.object({
  abilities: z.array(AbilityDtoSchema).optional(),
});

export class SubjectDto extends createZodDto(subjectDtoSchema) {}
