import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSession, RelatedSessionModel, CompleteTimelineItem, RelatedTimelineItemModel } from "./index"

export const TimelineModel = z.object({
  id: z.string(),
  name: z.string(),
  sessionId: z.string(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class TimelineDto extends createZodDto(TimelineModel) {
}

export interface CompleteTimeline extends z.infer<typeof TimelineModel> {
  session: CompleteSession
  timelineItems: CompleteTimelineItem[]
}

/**
 * RelatedTimelineModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTimelineModel: z.ZodSchema<CompleteTimeline> = z.lazy(() => TimelineModel.extend({
  session: RelatedSessionModel,
  timelineItems: RelatedTimelineItemModel.array(),
}))
