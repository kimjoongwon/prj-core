import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { Roles } from "./enums"
import { CompleteTenant, RelatedTenantModel } from "./index"

export const RoleModel = z.object({
  id: z.string(),
  name: z.nativeEnum(Roles),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class RoleDto extends createZodDto(RoleModel) {
}

export interface CompleteRole extends z.infer<typeof RoleModel> {
  tenants: CompleteTenant[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  tenants: RelatedTenantModel.array(),
}))
