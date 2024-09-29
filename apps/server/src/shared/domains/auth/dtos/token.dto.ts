import { ClassField, StringField, TenantDto, UserDto } from '@shared';

export class TokenDto {
  @StringField()
  accessToken: string;

  @StringField()
  refreshToken: string;

  @ClassField(() => UserDto)
  user: UserDto;

  @ClassField(() => TenantDto)
  tenant: TenantDto;
}
