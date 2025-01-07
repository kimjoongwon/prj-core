import { OmitType, PartialType } from '@nestjs/swagger';
import { GroupDto } from './group.dto';

export class UpdateGroupDto extends PartialType(OmitType(GroupDto, ['space', 'users'])) {}
