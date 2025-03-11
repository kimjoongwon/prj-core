import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { GymDto } from '../gym.dto';
import { ClassField, UUIDField } from '../../decorators';
import { CreateSpaceDto } from './create-space.dto';

export class CreateGymDto extends OmitType(GymDto, [
  ...COMMON_ENTITY_FIELDS,
  'space',
  'depot',
  'spaceId',
]) {
  @UUIDField()
  categoryId: string;

  @ClassField(() => CreateSpaceDto)
  space: CreateSpaceDto;
}
