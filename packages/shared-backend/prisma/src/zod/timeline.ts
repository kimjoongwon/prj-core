import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSession, relatedSessionSchema, CompleteTimelineItem, relatedTimelineItemSchema } from "./index"

export const timelineSchema = z.object({
  id: z.string(),
  name: z.string(),
  sessionId: z.string(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class TimelineDto extends createZodDto(timelineSchema) {
}

export interface CompleteTimeline extends z.infer<typeof timelineSchema> {
  session: CompleteSession
  timelineItems: CompleteTimelineItem[]
}

/**
 * relatedTimelineSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTimelineSchema: z.ZodSchema<CompleteTimeline> = z.lazy(() => timelineSchema.extend({
  session: relatedSessionSchema,
  timelineItems: relatedTimelineItemSchema.array(),
}))
