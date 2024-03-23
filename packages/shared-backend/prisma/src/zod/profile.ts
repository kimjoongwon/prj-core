import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteUser, relatedUserSchema } from "./index"

export const profileSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ProfileDto extends createZodDto(profileSchema) {
}

export interface CompleteProfile extends z.infer<typeof profileSchema> {
  user: CompleteUser
}

/**
 * relatedProfileSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProfileSchema: z.ZodSchema<CompleteProfile> = z.lazy(() => profileSchema.extend({
  user: relatedUserSchema,
}))
