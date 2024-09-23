import { EnumField } from '../../../decorators/field.decorators';
import { UpdateServiceDto } from './update-service.dto';
import { $Enums } from '@prisma/client';

export class UpsertServiceDto extends UpdateServiceDto {
  @EnumField(() => $Enums.SERVICE_NAME)
  name: $Enums.SERVICE_NAME;
}
