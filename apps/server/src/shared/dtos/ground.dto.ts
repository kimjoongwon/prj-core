import { Ground as GroundEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, UUIDFieldOptional } from '../decorators';
import { WorkspaceDto } from './workspace.dto';
import { DepotDto } from './depot.dto';

export class GroundDto extends AbstractDto implements GroundEntity {
  @UUIDFieldOptional({ nullable: true })
  imageDepotId: string | null;

  @UUIDFieldOptional({ nullable: true })
  workspaceId: string;

  @ClassField(() => WorkspaceDto, { required: false, nullable: true })
  workspace?: WorkspaceDto | null;

  @ClassField(() => DepotDto, { required: false, nullable: true })
  imageDepot?: DepotDto | null;
}
