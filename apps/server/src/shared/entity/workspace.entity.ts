import { Workspace as WorkspaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { WorkspaceDto } from '../dto/workspace.dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(WorkspaceDto)
export class Workspace extends AbstractEntity<WorkspaceDto> implements WorkspaceEntity {
  name: string;
  label: string | null;
  address: string;
  email: string;
  phone: string;
  businessNo: string;
  logoImageDepotId: string | null;
  spaceId: string;
}
