import { EnumField, StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Service } from '../service.entity';
import { $Enums } from '@prisma/client';

export class ServiceDto extends AbstractDto implements Service {
  @StringField({ nullable: true })
  label: string | null;

  @EnumField(() => $Enums.SERVICE_NAME)
  name: $Enums.SERVICE_NAME;
}
