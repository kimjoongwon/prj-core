import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"

export const EmailTemplateModel = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class EmailTemplateDto extends createZodDto(EmailTemplateModel) {
}
