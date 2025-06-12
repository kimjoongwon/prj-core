import { Profile } from '@prisma/client';
import { ClassField, StringField, UUIDField } from '../decorator/field.decorators';
import { User } from '../entity/user.entity';
import { AbstractDto } from './abstract.dto';

export class ProfileDto extends AbstractDto implements Profile {
  @UUIDField({ nullable: true })
  avatarFileId: string | null;

  @StringField()
  name: string;

  @StringField()
  nickname: string;

  @StringField()
  userId: string;

  @ClassField(() => User, { required: false })
  user?: User;
}
