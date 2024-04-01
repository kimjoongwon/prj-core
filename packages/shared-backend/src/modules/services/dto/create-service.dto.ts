import { createZodDto } from 'nestjs-zod/dto';
import { serviceSchema } from '../../../../prisma/src/zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { SERVICE_NAME } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { SERVICE_NAMESchema } from '../../../../prisma/generated/zod';

export const createServiceDtoZodSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const serviceFormDtoZodSchema = z.object({
  nameOptions: z.array(
    z.object({ text: z.string(), value: SERVICE_NAMESchema }),
  ),
  name: SERVICE_NAMESchema,
});

export class ServiceFormDto extends createZodDto(serviceFormDtoZodSchema) {}

export const serviceFormDto = {
  nameOptions: [
    { text: '이용자 서비스', value: SERVICE_NAME.userService },
    { text: '설정 서비스', value: SERVICE_NAME.settingService },
  ],
  name: SERVICE_NAME.userService,
};

export class CreateServiceDto extends createZodDto(createServiceDtoZodSchema) {}

export const createServiceDtoJsonSchema = zodToJsonSchema(
  createServiceDtoZodSchema,
);

export type CreateServiceDtoJsonSchema = typeof createServiceDtoJsonSchema;
