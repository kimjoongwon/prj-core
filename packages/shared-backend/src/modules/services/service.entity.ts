import { Service, SERVICE_NAME } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod/dto';
import { commonSchema } from '../../schema/common.schema';
import { zodToJsonSchema } from 'zod-to-json-schema';
export const serviceEntitySchema = z
  .object({
    name: z
      .nativeEnum(SERVICE_NAME, {
        invalid_type_error: 'Invalid service name',
        required_error: 'Service name is required',
        description: 'Service name',
      })
      .default(SERVICE_NAME.userService)
      .describe('Service name'),
  })
  .merge(commonSchema)
  .required();

export class ServiceEntity
  extends createZodDto(serviceEntitySchema)
  implements Service {}

export const serviceJsonSchema = zodToJsonSchema(serviceEntitySchema, {
  errorMessages: true,
});
