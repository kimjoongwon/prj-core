import { Ability, AbilityActions, AbilityTypes } from '@coc/database';
import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';

export const AbilityEntitySchema = z
  .object({
    type: z.nativeEnum(AbilityTypes).default(AbilityTypes.CAN),
    roleId: z.string(),
    action: z.nativeEnum(AbilityActions).default(AbilityActions.READ),
    subjectId: z.string(),
  })
  .merge(CommonEntitySchema);

export class AbilityEntity
  extends createZodDto(AbilityEntitySchema)
  implements Ability {}
