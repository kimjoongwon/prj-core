import * as z from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod/dto"

export const PageModel = z.object({
  id: z.string(),
  name: z.string(),
  pathname: z.string(),
  subjectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export class PageDto extends createZodDto(PageModel) {
}
