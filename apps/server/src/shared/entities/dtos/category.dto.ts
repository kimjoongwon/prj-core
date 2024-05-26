import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '../../decorators';
import { AbstractDto } from './common/abstract.dto';
import { CategoryEntity } from '../models/category.entity';

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
