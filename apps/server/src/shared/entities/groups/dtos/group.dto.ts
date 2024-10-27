import { StringField, UUIDFieldOptional } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';

export class GroupDto extends AbstractDto {
  @StringField()
  id: string;

  @StringField()
  name: string;

  @UUIDFieldOptional()
  tenantId: string;

  @StringField()
  serviceId: string;
}
