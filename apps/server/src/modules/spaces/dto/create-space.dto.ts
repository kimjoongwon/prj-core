import { Space } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { CommonEntity } from 'src/common/types/CommonEntity';
import { z } from 'nestjs-zod/z';

export const defaultSpaceObject: Space = {
  id: '',
  name: '',
  phone: '',
  address: '',
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
};

export const CreateSpaceSchema = z
  .object({
    name: z.string().default(defaultSpaceObject.name),
    phone: z.string().default(defaultSpaceObject.phone),
    address: z.string().default(defaultSpaceObject.address),
  })
  .required();

export class CreateSpaceDto
  extends createZodDto(CreateSpaceSchema)
  implements Omit<Space, CommonEntity> {}
