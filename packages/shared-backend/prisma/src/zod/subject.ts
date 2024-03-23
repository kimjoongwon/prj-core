import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteAbility, relatedAbilitySchema } from "./index"

export const subjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SubjectDto extends createZodDto(subjectSchema) {
}

export interface CompleteSubject extends z.infer<typeof subjectSchema> {
  abilities: CompleteAbility[]
}

/**
 * relatedSubjectSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSubjectSchema: z.ZodSchema<CompleteSubject> = z.lazy(() => subjectSchema.extend({
  abilities: relatedAbilitySchema.array(),
}))
