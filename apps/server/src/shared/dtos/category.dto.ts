import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './common';
import { StringField } from '../decorators';
import { CategoryEntity } from '../entities';

export class CategoryDto extends AbstractDto {
  @StringField()
  name: string;

  @ApiProperty({ type: String, isArray: true })
  ancestorIds: string[];

  @StringField({ nullable: true })
  parentId: string | null;

  @StringField()
  spaceId: string;

  @StringField()
  serviceId: string;

  constructor(categoryEntity: CategoryEntity) {
    super(categoryEntity);
    this.name = categoryEntity.name;
    this.ancestorIds = categoryEntity.ancestorIds;
    this.parentId = categoryEntity.parentId;
    this.spaceId = categoryEntity.spaceId;
    this.serviceId = categoryEntity.serviceId;
  }
}
