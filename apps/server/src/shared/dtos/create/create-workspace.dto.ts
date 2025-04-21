import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { WorkspaceDto } from '../workspace.dto';

export class CreateWorkspaceDto extends OmitType(WorkspaceDto, [...COMMON_ENTITY_FIELDS]) {}
