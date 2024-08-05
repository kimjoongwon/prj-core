import { TenantDto, UserDto } from '@shared';
import { ClassField, StringField } from 'src/shared/decorators/field.decorators';

export class TokenDto {
  @StringField()
  accessToken: string;

  @StringField()
  refreshToken: string;

  @ClassField(() => UserDto)
  user: UserDto;

  @ClassField(() => TenantDto)
  tenant: TenantDto;

  constructor(accessToken: string, refreshToken: string, user: UserDto, tenant: TenantDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    this.tenant = tenant;
  }
}
