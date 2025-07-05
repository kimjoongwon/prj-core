import { ClassField, StringField, UUIDField } from '../../../decorator/field.decorators';
import { UserDto } from '@shared/schema';

export class TokenDto {
  @StringField()
  accessToken: string;

  @StringField()
  refreshToken: string;

  @ClassField(() => UserDto)
  user: UserDto;

  @UUIDField()
  mainTenantId: string;
}
