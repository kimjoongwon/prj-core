import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteReservation, relatedReservationSchema, CompleteTimeline, relatedTimelineSchema } from "./index"

export const timelineItemSchema = z.object({
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

export class TimelineItemDto extends createZodDto(timelineItemSchema) {
}

export interface CompleteTimelineItem extends z.infer<typeof timelineItemSchema> {
  reservations: CompleteReservation[]
  timeline?: CompleteTimeline | null
}

/**
 * relatedTimelineItemSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTimelineItemSchema: z.ZodSchema<CompleteTimelineItem> = z.lazy(() => timelineItemSchema.extend({
  reservations: relatedReservationSchema.array(),
  timeline: relatedTimelineSchema.nullish(),
}))
