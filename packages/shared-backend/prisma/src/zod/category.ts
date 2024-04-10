import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteClassification, relatedClassificationSchema, CompleteSpace, relatedSpaceSchema } from "./index"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  ancestorIds: z.string().array(),
  parentId: z.string().nullish(),
  spaceId: z.string(),
  serviceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class CategoryDto extends createZodDto(categorySchema) {
}

export interface CompleteCategory extends z.infer<typeof categorySchema> {
  classifications: CompleteClassification[]
  space: CompleteSpace
}

/**
 * relatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() => categorySchema.extend({
  classifications: relatedClassificationSchema.array(),
  space: relatedSpaceSchema,
}))
