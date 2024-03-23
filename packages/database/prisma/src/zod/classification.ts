import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteService, RelatedServiceModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const ClassificationModel = z.object({
  id: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ClassificationDto extends createZodDto(ClassificationModel) {
}

export interface CompleteClassification extends z.infer<typeof ClassificationModel> {
  service: CompleteService
  category: CompleteCategory
}

/**
 * RelatedClassificationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedClassificationModel: z.ZodSchema<CompleteClassification> = z.lazy(() => ClassificationModel.extend({
  service: RelatedServiceModel,
  category: RelatedCategoryModel,
}))
