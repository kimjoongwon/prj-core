import { StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Service } from '../service.entity';

export class ServiceDto extends AbstractDto implements Service {
  @StringField()
  name: string;
}
