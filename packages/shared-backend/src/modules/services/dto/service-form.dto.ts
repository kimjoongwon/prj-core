import { nativeEnum, z } from 'nestjs-zod/z';
import { serviceEntitySchema } from '../service.entity';
import { createZodDto } from 'nestjs-zod';
import { SERVICE_NAME } from '@prisma/client';

export const serviceFormDtoSchema = z.object({
  defaultObject: z.object({
    name: z.nativeEnum(SERVICE_NAME).default(SERVICE_NAME.userService),
  }),
  form: z.object({
    nameOptions: z.array(
      z.object({
        text: z.enum(['설정 서비스', '유저 서비스']),
        value: z.nativeEnum(SERVICE_NAME),
      }),
    ),
  }),
  schema: z.object({}),
});

export class ServiceFormDto extends createZodDto(serviceFormDtoSchema) {}
