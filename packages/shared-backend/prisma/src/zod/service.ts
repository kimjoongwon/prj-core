import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"
import { SERVICE_NAME } from "./enums"
import { CompleteClassification, relatedClassificationSchema, CompleteAssignment, relatedAssignmentSchema, CompleteCategory, relatedCategorySchema } from "./index"

export const serviceSchema = z.object({
  id: z.string(),
  name: z.nativeEnum(SERVICE_NAME),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class ServiceDto extends createZodDto(serviceSchema) {
}

export interface CompleteService extends z.infer<typeof serviceSchema> {
  classifications: CompleteClassification[]
  assignments: CompleteAssignment[]
  categories: CompleteCategory[]
}

/**
 * relatedServiceSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedServiceSchema: z.ZodSchema<CompleteService> = z.lazy(() => serviceSchema.extend({
  classifications: relatedClassificationSchema.array(),
  assignments: relatedAssignmentSchema.array(),
  categories: relatedCategorySchema.array(),
}))
