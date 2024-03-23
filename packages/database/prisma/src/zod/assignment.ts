import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteGroup, RelatedGroupModel, CompleteService, RelatedServiceModel } from "./index"

export const AssignmentModel = z.object({
  id: z.string(),
  groupId: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class AssignmentDto extends createZodDto(AssignmentModel) {
}

export interface CompleteAssignment extends z.infer<typeof AssignmentModel> {
  group: CompleteGroup
  service: CompleteService
}

/**
 * RelatedAssignmentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAssignmentModel: z.ZodSchema<CompleteAssignment> = z.lazy(() => AssignmentModel.extend({
  group: RelatedGroupModel,
  service: RelatedServiceModel,
}))
