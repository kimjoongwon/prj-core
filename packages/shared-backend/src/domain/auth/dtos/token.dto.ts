import { ClassField, StringField, UserDto, UUIDField } from '@shared/backend';

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
