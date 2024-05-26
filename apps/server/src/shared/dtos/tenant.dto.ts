import { AbstractDto } from 'src/shared/dtos/common';
import { TenantEntity } from '../entities/tenant.entity';
import { StringField } from 'src/shared/decorators';

export class TenantDto extends AbstractDto {
  @StringField()
  userId: string;

  @StringField()
  spaceId: string;

  @StringField()
  roleId: string;

  constructor(tenant: TenantEntity) {
    super(tenant);
    this.id = tenant.id;
    this.createdAt = tenant.createdAt;
    this.updatedAt = tenant.updatedAt;
    this.deletedAt = tenant.deletedAt;
    this.userId = tenant.userId;
    this.spaceId = tenant.spaceId;
    this.roleId = tenant.roleId;
  }
}
