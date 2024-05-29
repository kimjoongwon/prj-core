import { PartialType } from '@nestjs/swagger';
import { GroupEntity } from '../../models/group.entity';

export class UpdateGroupDto extends PartialType(GroupEntity) {}
