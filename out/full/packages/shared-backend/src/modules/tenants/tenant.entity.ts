import { Tenant } from '@prisma/client';
import { CommonEntity } from '../../entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class TenantEntity extends CommonEntity implements Tenant {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  spaceId: string;
  @ApiProperty()
  roleId: string;
}
