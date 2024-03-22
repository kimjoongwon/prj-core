import { Page } from '@coc/database';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';

export const pageEntitySchema = z
  .object({
    name: z.string(),
    pathname: z.string(),
    subjectId: z.string(),
  })
  .merge(CommonEntitySchema);

export class PageEntity
  extends createZodDto(pageEntitySchema)
  implements Page {}
