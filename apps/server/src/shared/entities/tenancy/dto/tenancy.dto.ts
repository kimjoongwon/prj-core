import { StringField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Tenancy } from '../tenancy.entity';

export class TenancyDto extends AbstractDto implements Tenancy {
  constructor(tenancy: Tenancy) {
    super(tenancy);
    this.spaceId = tenancy.spaceId;
  }
  @StringField()
  spaceId: string;
}
