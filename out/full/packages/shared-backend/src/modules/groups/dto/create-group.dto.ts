import { OmitType } from '@nestjs/swagger';
import { GroupEntity } from '../entities/group.entity';

export class CreateGroupDto extends OmitType(GroupEntity, [
  'createdAt',
  'deletedAt',
  'updatedAt',
  'id',
]) {}
