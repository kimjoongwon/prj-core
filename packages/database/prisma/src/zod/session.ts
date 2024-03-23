import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTimeline, RelatedTimelineModel } from "./index"

export const SessionModel = z.object({
  id: z.string(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.date().array(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class SessionDto extends createZodDto(SessionModel) {
}

export interface CompleteSession extends z.infer<typeof SessionModel> {
  timelines: CompleteTimeline[]
}

/**
 * RelatedSessionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSessionModel: z.ZodSchema<CompleteSession> = z.lazy(() => SessionModel.extend({
  timelines: RelatedTimelineModel.array(),
}))
