import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteClassification, RelatedClassificationModel, CompleteAssignment, RelatedAssignmentModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const ServiceModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ServiceDto extends createZodDto(ServiceModel) {
}

export interface CompleteService extends z.infer<typeof ServiceModel> {
  classifications: CompleteClassification[]
  assignments: CompleteAssignment[]
  categories: CompleteCategory[]
}

/**
 * RelatedServiceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedServiceModel: z.ZodSchema<CompleteService> = z.lazy(() => ServiceModel.extend({
  classifications: RelatedClassificationModel.array(),
  assignments: RelatedAssignmentModel.array(),
  categories: RelatedCategoryModel.array(),
}))
