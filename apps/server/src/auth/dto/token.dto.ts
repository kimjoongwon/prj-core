import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@shared/backend';
import { Type } from 'class-transformer';

export class TokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    type: () => UserDto,
  })
  @Type(() => UserDto)
  user: UserDto;

  constructor(accessToken: string, refreshToken: string, user: UserDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
