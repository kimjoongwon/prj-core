import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteTimelineItem, RelatedTimelineItemModel } from "./index"

export const ReservationModel = z.object({
  id: z.string(),
  status: z.string(),
  timelineItemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ReservationDto extends createZodDto(ReservationModel) {
}

export interface CompleteReservation extends z.infer<typeof ReservationModel> {
  timelineItem: CompleteTimelineItem
}

/**
 * RelatedReservationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedReservationModel: z.ZodSchema<CompleteReservation> = z.lazy(() => ReservationModel.extend({
  timelineItem: RelatedTimelineItemModel,
}))
