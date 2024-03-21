import { Subject } from '@coc/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntity } from 'src/types';

export const createSubjectDtoSchema = z.object({
  name: z.string(),
});

export class CreateSubjectDto
  extends createZodDto(createSubjectDtoSchema)
  implements Omit<Subject, CommonEntity> {}
