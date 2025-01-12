import { OmitType } from '@nestjs/swagger';
import { SpaceDto } from '../space.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { UUIDField } from '../../decorators';

export class CreateSpaceDto extends OmitType(SpaceDto, [
  ...COMMON_ENTITY_FIELDS,
  'associations',
  'classification',
]) {
  @UUIDField()
  categoryId: string;

  @UUIDField()
  serviceId: string;
}
