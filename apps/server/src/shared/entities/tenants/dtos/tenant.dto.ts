import {
  BooleanField,
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from 'src/shared/decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Tenant } from '../tenant.entity';
import { $Enums } from '@prisma/client';
import { TenancyDto } from '../../tenancies';

export class TenantDto extends AbstractDto implements Tenant {
  @StringField()
  userId: string;

  @StringField()
  roleId: string;

  constructor(tenant: Tenant) {
    super(tenant);
    Object.assign(this, tenant);
  }

  @UUIDField()
  tenancyId: string;

  @BooleanField()
  active: boolean;

  @EnumField(() => $Enums.TenantTypes)
  type: $Enums.TenantTypes;

  @ClassField(() => TenancyDto)
  tenancy?: TenancyDto;
}
