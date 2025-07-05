import { StringField, ClassField } from '../../decorator/field.decorators';
import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    description: 'JWT Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @StringField()
  accessToken: string;

  @ApiProperty({
    description: 'JWT Refresh Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @StringField()
  refreshToken: string;

  @ApiProperty({
    description: '인증된 사용자 정보',
    type: () => UserDto,
  })
  @ClassField(() => UserDto)
  user: UserDto;

  @ApiProperty({
    description: '메인 테넌트 ID',
    example: 'uuid-string',
  })
  @StringField()
  mainTenantId: string;
}
