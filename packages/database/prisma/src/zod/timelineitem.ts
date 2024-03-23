import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteReservation, RelatedReservationModel, CompleteTimeline, RelatedTimelineModel } from "./index"

export const TimelineItemModel = z.object({
  id: z.string(),
  timelineId: z.string().nullish(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  description: z.string(),
  address: z.string().nullish(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class TimelineItemDto extends createZodDto(TimelineItemModel) {
}

export interface CompleteTimelineItem extends z.infer<typeof TimelineItemModel> {
  reservations: CompleteReservation[]
  timeline?: CompleteTimeline | null
}

/**
 * RelatedTimelineItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTimelineItemModel: z.ZodSchema<CompleteTimelineItem> = z.lazy(() => TimelineItemModel.extend({
  reservations: RelatedReservationModel.array(),
  timeline: RelatedTimelineModel.nullish(),
}))
