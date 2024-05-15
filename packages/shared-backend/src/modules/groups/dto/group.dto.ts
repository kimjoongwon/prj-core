import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../../entity/common.entity';
import { ServiceEntity } from '../../services/service.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { SpaceEntity } from '../../spaces';

export class GroupDto extends CommonEntity {
  @Exclude()
  _name: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty({
    type: () => ServiceEntity,
    nullable: true,
  })
  service?: ServiceEntity;

  @Type(() => SpaceEntity)
  @ApiProperty({
    type: () => SpaceEntity,
    nullable: true,
  })
  space?: SpaceEntity;

  constructor(partial: Partial<GroupDto>) {
    super();
    Object.assign(this, partial);
  }

  // @ApiProperty({
  //   type: String,
  // })
  // get name(): string {
  //   return this._name;
  // }
}
