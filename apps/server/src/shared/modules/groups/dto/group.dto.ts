import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../../entity/common.entity';
import { Exclude, Expose } from 'class-transformer';
import { GroupEntity } from '../entities/group.entity';

export class GroupDto extends CommonEntity {
  @Exclude() _name: string;
  @Exclude() _spaceId: string;
  @Exclude() _serviceId: string;

  constructor(group: GroupEntity) {
    super(group.id, group.createdAt, group.updatedAt, group.deletedAt);
    this._name = group.name;
    this._spaceId = group.spaceId;
    this._serviceId = group.serviceId;
  }

  @ApiProperty({
    type: String,
  })
  @Expose()
  get name(): string {
    return this._name;
  }

  @ApiProperty({
    type: String,
  })
  @Expose()
  get spaceId(): string {
    return this._spaceId;
  }

  @ApiProperty({
    type: String,
  })
  @Expose()
  get serviceId(): string {
    return this._serviceId;
  }
}
