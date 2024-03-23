import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteUser, RelatedUserModel } from "./index"

export const ProfileModel = z.object({
  id: z.string(),
  nickname: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ProfileDto extends createZodDto(ProfileModel) {
}

export interface CompleteProfile extends z.infer<typeof ProfileModel> {
  user: CompleteUser
}

/**
 * RelatedProfileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfileModel: z.ZodSchema<CompleteProfile> = z.lazy(() => ProfileModel.extend({
  user: RelatedUserModel,
}))
