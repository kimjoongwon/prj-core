import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTimeline, relatedTimelineSchema } from "./index"

export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.date().array(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SessionDto extends createZodDto(sessionSchema) {
}

export interface CompleteSession extends z.infer<typeof sessionSchema> {
  timelines: CompleteTimeline[]
}

/**
 * relatedSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSessionSchema: z.ZodSchema<CompleteSession> = z.lazy(() => sessionSchema.extend({
  timelines: relatedTimelineSchema.array(),
}))
