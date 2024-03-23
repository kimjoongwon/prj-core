import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { CompleteGroup, relatedGroupSchema, CompleteService, relatedServiceSchema } from "./index"

export const assignmentSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class AssignmentDto extends createZodDto(assignmentSchema) {
}

export interface CompleteAssignment extends z.infer<typeof assignmentSchema> {
  group: CompleteGroup
  service: CompleteService
}

/**
 * relatedAssignmentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAssignmentSchema: z.ZodSchema<CompleteAssignment> = z.lazy(() => assignmentSchema.extend({
  group: relatedGroupSchema,
  service: relatedServiceSchema,
}))
