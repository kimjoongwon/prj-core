import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTenant, relatedTenantSchema, CompleteCategory, relatedCategorySchema, CompleteGroup, relatedGroupSchema } from "./index"

export const spaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SpaceDto extends createZodDto(spaceSchema) {
}

export interface CompleteSpace extends z.infer<typeof spaceSchema> {
  tenants: CompleteTenant[]
  categories: CompleteCategory[]
  groups: CompleteGroup[]
}

/**
 * relatedSpaceSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSpaceSchema: z.ZodSchema<CompleteSpace> = z.lazy(() => spaceSchema.extend({
  tenants: relatedTenantSchema.array(),
  categories: relatedCategorySchema.array(),
  groups: relatedGroupSchema.array(),
}))
