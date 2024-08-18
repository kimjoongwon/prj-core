import { PartialType } from '@nestjs/swagger';
import { GroupEntity } from '../group.entity';

export class UpdateGroupDto extends PartialType(GroupEntity) {}
