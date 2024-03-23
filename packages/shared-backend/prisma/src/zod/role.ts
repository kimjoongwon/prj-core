import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { Roles } from "./enums"
import { CompleteTenant, relatedTenantSchema } from "./index"

export const roleSchema = z.object({
  id: z.string(),
  name: z.nativeEnum(Roles),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class RoleDto extends createZodDto(roleSchema) {
}

export interface CompleteRole extends z.infer<typeof roleSchema> {
  tenants: CompleteTenant[]
}

/**
 * relatedRoleSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRoleSchema: z.ZodSchema<CompleteRole> = z.lazy(() => roleSchema.extend({
  tenants: relatedTenantSchema.array(),
}))
