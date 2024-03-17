import { Tenant } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntity } from 'src/types';
import zodToJsonSchema from 'zod-to-json-schema';

export const defaultTenantObject: Tenant = {
  id: '',
  userId: '',
  spaceId: '',
  roleId: '',
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
};

export const CreateTenantSchema = z
  .object({
    userId: z.string().default(defaultTenantObject.userId),
    spaceId: z.string().default(defaultTenantObject.spaceId),
    roleId: z.string().default(defaultTenantObject.roleId),
  })
  .required();

export class CreateTenantDto
  extends createZodDto(CreateTenantSchema)
  implements Omit<Tenant, CommonEntity> {}

export const jsonCreateTenantSchema = zodToJsonSchema(
  CreateTenantSchema,
);
