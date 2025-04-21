import { PartialType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from '../create';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}