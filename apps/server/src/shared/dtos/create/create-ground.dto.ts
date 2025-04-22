import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { GroundDto } from '../ground.dto';
import { ClassField, UUIDFieldOptional } from '../../decorators/field.decorators';
import { CreateWorkspaceDto } from './create-workspace.dto';

export class CreateGroundDto extends OmitType(GroundDto, [
  ...COMMON_ENTITY_FIELDS,
  'workspace',
  'imageDepot',
  'workspaceId',
]) {
  @ClassField(() => CreateWorkspaceDto)
  workspace: CreateWorkspaceDto;

  @UUIDFieldOptional()
  imageDepotId: string;
}
