import { ApiProperty } from '@nestjs/swagger';
import { SpaceDto } from '../../spaces';
import { TenantDto } from './tenant.dto';
import { Exclude } from 'class-transformer';

export class RelatedTenantDto extends TenantDto {
  @Exclude() private readonly _space: SpaceDto;

  @ApiProperty({
    type: () => SpaceDto,
  })
  get space(): SpaceDto {
    return this._space;
  }
}
