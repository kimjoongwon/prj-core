import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteProfile, RelatedProfileModel, CompleteTenant, RelatedTenantModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  createdAt: z.date(),
})

export class UserDto extends createZodDto(UserModel) {
}

export interface CompleteUser extends z.infer<typeof UserModel> {
  profiles: CompleteProfile[]
  tenants: CompleteTenant[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  profiles: RelatedProfileModel.array(),
  tenants: RelatedTenantModel.array(),
}))
