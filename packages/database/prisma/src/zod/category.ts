import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSpace, RelatedSpaceModel, CompleteClassification, RelatedClassificationModel, CompleteService, RelatedServiceModel } from "./index"

export const CategoryModel = z.object({
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

export class CategoryDto extends createZodDto(CategoryModel) {
}

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  space: CompleteSpace
  classifications: CompleteClassification[]
  service: CompleteService
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() => CategoryModel.extend({
  space: RelatedSpaceModel,
  classifications: RelatedClassificationModel.array(),
  service: RelatedServiceModel,
}))
