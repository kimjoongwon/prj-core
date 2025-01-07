import { $Enums } from '@prisma/client';
import { EnumField, StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Service } from '../../service.entity';

export class ServiceDto extends AbstractDto implements Service {
  @EnumField(() => $Enums.ServiceNames)
  name: $Enums.ServiceNames;

  @StringField()
  label: string;
}
