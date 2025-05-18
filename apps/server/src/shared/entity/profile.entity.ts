import { Profile as ProfileEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { ProfileDto } from '../dto';

@UseDto(ProfileDto)
export class Profile extends AbstractEntity<ProfileDto> implements ProfileEntity {
  name: string;
  nickname: string;
  depotId: string | null;
  userId: string;
  user?: User;
}
