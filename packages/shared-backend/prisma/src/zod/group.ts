import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteSpace, relatedSpaceSchema, CompleteAssignment, relatedAssignmentSchema } from "./index"

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class GroupDto extends createZodDto(groupSchema) {
}

export interface CompleteGroup extends z.infer<typeof groupSchema> {
  space: CompleteSpace
  assignments: CompleteAssignment[]
}

/**
 * relatedGroupSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedGroupSchema: z.ZodSchema<CompleteGroup> = z.lazy(() => groupSchema.extend({
  space: relatedSpaceSchema,
  assignments: relatedAssignmentSchema.array(),
}))
