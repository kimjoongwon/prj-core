import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto, SpaceDto, TenantDto, UserEntity } from '../modules';

export class UserDto extends UserEntity {
  constructor(partial: Partial<UserDto>) {
    super(partial);
  }

  @ApiProperty({
    type: () => [TenantDto],
  })
  tenants: TenantDto[];

  @ApiProperty({
    type: () => [ProfileDto],
  })
  profiles: ProfileDto[];
}
