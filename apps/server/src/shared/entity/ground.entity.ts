import { Ground as GroundEntity, Workspace } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { GroundDto } from '../dto/ground.dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(GroundDto)
export class Ground extends AbstractEntity<GroundDto> implements GroundEntity {
  imageDepotId: string | null;
  workspaceId: string;
  workspace: Workspace;
}
