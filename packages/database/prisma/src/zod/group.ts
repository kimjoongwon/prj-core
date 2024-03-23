import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSpace, RelatedSpaceModel, CompleteAssignment, RelatedAssignmentModel } from "./index"

export const GroupModel = z.object({
  id: z.string(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class GroupDto extends createZodDto(GroupModel) {
}

export interface CompleteGroup extends z.infer<typeof GroupModel> {
  space: CompleteSpace
  assignments: CompleteAssignment[]
}

/**
 * RelatedGroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGroupModel: z.ZodSchema<CompleteGroup> = z.lazy(() => GroupModel.extend({
  space: RelatedSpaceModel,
  assignments: RelatedAssignmentModel.array(),
}))
