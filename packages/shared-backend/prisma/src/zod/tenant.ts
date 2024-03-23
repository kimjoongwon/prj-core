import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteRole, relatedRoleSchema, CompleteSpace, relatedSpaceSchema, CompleteUser, relatedUserSchema } from "./index"

export const tenantSchema = z.object({
  id: z.string(),
  userId: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class TenantDto extends createZodDto(tenantSchema) {
}

export interface CompleteTenant extends z.infer<typeof tenantSchema> {
  role: CompleteRole
  space: CompleteSpace
  user: CompleteUser
}

/**
 * relatedTenantSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTenantSchema: z.ZodSchema<CompleteTenant> = z.lazy(() => tenantSchema.extend({
  role: relatedRoleSchema,
  space: relatedSpaceSchema,
  user: relatedUserSchema,
}))
