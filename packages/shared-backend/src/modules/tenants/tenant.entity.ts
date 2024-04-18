import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { Tenant } from '@prisma/client';
import { userEntitySchema } from '../users';
import { spaceEntitySchema } from '../spaces';
import { CommonEntity } from '../../entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const tenantEntitySchema = z
  .object({
    userId: z.string(),
    spaceId: z.string(),
    roleId: z.string(),
  })
  .merge(commonSchema);

export const relatedTenantEntitySchema = z.object({
  user: userEntitySchema,
  space: spaceEntitySchema,
});

export abstract class TenantEntity extends CommonEntity implements Tenant {
  @Exclude() _userId: string;
  @Exclude() _spaceId: string;
  @Exclude() _roleId: string;

  constructor(tenant: Tenant) {
    super();
    Object.assign(this, tenant);
  }

  @Expose()
  @ApiProperty()
  get userId(): string {
    return this._userId;
  }

  @Expose()
  @ApiProperty()
  get spaceId(): string {
    return this._spaceId;
  }

  @Expose()
  @ApiProperty()
  get roleId(): string {
    return this._roleId;
  }
}
