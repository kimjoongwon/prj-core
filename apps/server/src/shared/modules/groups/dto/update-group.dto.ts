import { PartialType } from '@nestjs/swagger';
import { GroupEntity } from '../entities/group.entity';

export class UpdateGroupDto extends PartialType(GroupEntity) {}
