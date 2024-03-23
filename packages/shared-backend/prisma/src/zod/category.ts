import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSpace, relatedSpaceSchema, CompleteClassification, relatedClassificationSchema, CompleteService, relatedServiceSchema } from "./index"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  ancestorIds: z.string().array(),
  parentId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class CategoryDto extends createZodDto(categorySchema) {
}

export interface CompleteCategory extends z.infer<typeof categorySchema> {
  space: CompleteSpace
  classifications: CompleteClassification[]
  service: CompleteService
}

/**
 * relatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() => categorySchema.extend({
  space: relatedSpaceSchema,
  classifications: relatedClassificationSchema.array(),
  service: relatedServiceSchema,
}))
