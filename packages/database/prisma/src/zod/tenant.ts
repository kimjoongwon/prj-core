import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteRole, RelatedRoleModel, CompleteSpace, RelatedSpaceModel, CompleteUser, RelatedUserModel } from "./index"

export const TenantModel = z.object({
  id: z.string(),
  userId: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class TenantDto extends createZodDto(TenantModel) {
}

export interface CompleteTenant extends z.infer<typeof TenantModel> {
  role: CompleteRole
  space: CompleteSpace
  user: CompleteUser
}

/**
 * RelatedTenantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTenantModel: z.ZodSchema<CompleteTenant> = z.lazy(() => TenantModel.extend({
  role: RelatedRoleModel,
  space: RelatedSpaceModel,
  user: RelatedUserModel,
}))
