import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteProfile, relatedProfileSchema, CompleteTenant, relatedTenantSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  createdAt: z.date(),
})

export class UserDto extends createZodDto(userSchema) {
}

export interface CompleteUser extends z.infer<typeof userSchema> {
  profiles: CompleteProfile[]
  tenants: CompleteTenant[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  profiles: relatedProfileSchema.array(),
  tenants: relatedTenantSchema.array(),
}))
