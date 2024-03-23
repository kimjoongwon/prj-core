import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTimelineItem, relatedTimelineItemSchema } from "./index"

export const reservationSchema = z.object({
  id: z.string(),
  status: z.string(),
  timelineItemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ReservationDto extends createZodDto(reservationSchema) {
}

export interface CompleteReservation extends z.infer<typeof reservationSchema> {
  timelineItem: CompleteTimelineItem
}

/**
 * relatedReservationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedReservationSchema: z.ZodSchema<CompleteReservation> = z.lazy(() => reservationSchema.extend({
  timelineItem: relatedTimelineItemSchema,
}))
