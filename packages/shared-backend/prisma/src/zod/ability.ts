import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { AbilityTypes, AbilityActions } from "./enums"
import { CompleteSubject, relatedSubjectSchema } from "./index"

export const abilitySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(AbilityTypes),
  roleId: z.string(),
  action: z.nativeEnum(AbilityActions),
  subjectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class AbilityDto extends createZodDto(abilitySchema) {
}

export interface CompleteAbility extends z.infer<typeof abilitySchema> {
  subject: CompleteSubject
}

/**
 * relatedAbilitySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAbilitySchema: z.ZodSchema<CompleteAbility> = z.lazy(() => abilitySchema.extend({
  subject: relatedSubjectSchema,
}))
