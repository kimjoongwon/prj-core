import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto, SpaceDto, TenantDto, UserEntity } from '../modules';

export class UserDto extends UserEntity {
  @ApiProperty({
    isArray: true,
    type: () => [TenantDto],
  })
  tenants: TenantDto[];

  @ApiProperty({
    isArray: true,
    type: () => [ProfileDto],
  })
  profiles: ProfileDto[];
}
