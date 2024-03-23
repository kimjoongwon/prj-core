import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTenant, RelatedTenantModel, CompleteCategory, RelatedCategoryModel, CompleteGroup, RelatedGroupModel } from "./index"

export const SpaceModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SpaceDto extends createZodDto(SpaceModel) {
}

export interface CompleteSpace extends z.infer<typeof SpaceModel> {
  tenants: CompleteTenant[]
  categories: CompleteCategory[]
  groups: CompleteGroup[]
}

/**
 * RelatedSpaceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSpaceModel: z.ZodSchema<CompleteSpace> = z.lazy(() => SpaceModel.extend({
  tenants: RelatedTenantModel.array(),
  categories: RelatedCategoryModel.array(),
  groups: RelatedGroupModel.array(),
}))
