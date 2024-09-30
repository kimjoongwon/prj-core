import { StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Service } from '../service.entity';

export class ServiceDto extends AbstractDto implements Service {
  @StringField({ nullable: true })
  label: string | null;

  @StringField()
  name: string;
}
