import { UserAssociation as UserAssociationEntity } from '@prisma/client';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { Group } from './group.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { UserAssociationDto } from '../dto/user-association.dto';

@UseDto(UserAssociationDto)
export class UserAssociation extends AbstractEntity<UserAssociationDto> implements UserAssociationEntity {
  userId: string;
  groupId: string;

  group?: Group;
  user?: User;
}
