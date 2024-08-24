import { StringField } from 'src/shared/decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Service } from '../service.entity';

export class ServiceDto extends AbstractDto implements Service {
  @StringField()
  label: string | null;

  @StringField()
  name: string;

  constructor(service: Service) {
    super(service);
    this.label = service.label;
    this.name = service.name;
  }
}
