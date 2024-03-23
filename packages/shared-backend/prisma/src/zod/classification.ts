import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteService, relatedServiceSchema, CompleteCategory, relatedCategorySchema } from "./index"

export const classificationSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ClassificationDto extends createZodDto(classificationSchema) {
}

export interface CompleteClassification extends z.infer<typeof classificationSchema> {
  service: CompleteService
  category: CompleteCategory
}

/**
 * relatedClassificationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedClassificationSchema: z.ZodSchema<CompleteClassification> = z.lazy(() => classificationSchema.extend({
  service: relatedServiceSchema,
  category: relatedCategorySchema,
}))
