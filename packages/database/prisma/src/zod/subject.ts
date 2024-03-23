import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteAbility, RelatedAbilityModel } from "./index"

export const SubjectModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SubjectDto extends createZodDto(SubjectModel) {
}

export interface CompleteSubject extends z.infer<typeof SubjectModel> {
  abilities: CompleteAbility[]
}

/**
 * RelatedSubjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubjectModel: z.ZodSchema<CompleteSubject> = z.lazy(() => SubjectModel.extend({
  abilities: RelatedAbilityModel.array(),
}))
