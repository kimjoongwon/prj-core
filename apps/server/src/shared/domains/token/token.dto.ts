import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../entities/users/dtos/user.dto';
import { ClassField } from '../../decorators';

export class TokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    type: () => UserDto,
  })
  @ClassField(() => UserDto, { nullable: true, each: false, swagger: false })
  user?: UserDto;
}
