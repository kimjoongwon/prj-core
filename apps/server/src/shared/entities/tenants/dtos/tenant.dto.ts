import { StringField } from 'src/shared/decorators/field.decorators';
import { TenantEntity } from '../tenant.entity';
import { AbstractDto } from '../../common/dtos/abstract.dto';

export class TenantDto extends AbstractDto {
  @StringField()
  userId: string;

  @StringField()
  roleId: string;

  constructor(tenant: TenantEntity) {
    super(tenant);
    Object.assign(this, tenant);
  }
}
